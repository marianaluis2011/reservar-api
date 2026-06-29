import userService from '../services/userService.js';
import { generateToken } from '../libs/jwt.js';
import { sendRegisterEmail } from "../services/emailService.js";
import accommodationService from '../services/accommodationService.js';
import provinceService from '../services/provinceService.js';

const authController = {
  register: async (req, res) => {
    try {
      const { fullName, email, password, role, name, province, description, whatsapp } = req.body;
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
      }

      let provinceDoc = null;
      if (role === 'host') {
        if (!name || !province || !description || !whatsapp) {
          return res.status(400).json({ message: 'Faltan datos del hospedaje para registrar un anfitrión.' });
        }
        provinceDoc = await provinceService.buscarPorNombre(province);
        if (!provinceDoc) {
          return res.status(400).json({ message: `Por ahora solo operamos en las provincias disponibles. "${province}" no está habilitada.` });
        }
      }

      const newUser = await userService.createUser({ fullName, email, password, role });

      if (role === 'host') {
        try {
          await accommodationService.crear({
            name,
            description,
            province: provinceDoc._id,
            whatsapp,
            contactEmail: email,
            mainImage: 'https://placehold.co/1200x800?text=Hospedaje',
            admin: newUser._id,
            status: 'pendiente'
          });
        } catch (errHospedaje) {
          console.error("ERROR AL CREAR HOSPEDAJE:", errHospedaje.message);
        }
      }

      try {
        await sendRegisterEmail(email, fullName);
      } catch (error) {
        console.error('Error al enviar el email de registro:', error.message);
      }
      res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.findUserByEmail(email);
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }
      if (!user.isActive) {
        return res.status(403).json({ message: 'Usuario deshabilitado.' });
      }
      const token = generateToken({ id: user._id, email: user.email, role: user.role });
      res.status(200).json({
        message: 'Inicio de sesión exitoso.',
        token,
        user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      });

    } catch (error) {
      res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
  }
};

export default authController;