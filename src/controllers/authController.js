import userService from '../services/userService.js';
import { generateToken } from '../libs/jwt.js';
import { sendRegisterEmail } from "../services/emailService.js";

const authController = {
  register: async (req, res) => {
    try {
      const { fullName, email, password, role } = req.body;
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
      }
      const newUser = await userService.createUser({ fullName, email, password, role });
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
},

export default authController;