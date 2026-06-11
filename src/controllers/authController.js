import userService from '../services/user.services.js';
import { generateToken } from '../libs/jwt.js';

const authController = {
  register: async (req, res) => {
    try {
      const { nombre, apellido, email, password, rol } = req.body;
      if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ message: 'Nombre, apellido, email y contraseña son requeridos.' });
      }
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
      }
      const newUser = await userService.createUser({ nombre, apellido, email, password, rol });
      const token = generateToken({ id: newUser._id, email: newUser.email, rol: newUser.rol });
      res.status(201).json({ message: 'Usuario registrado exitosamente.', token });
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
      const token = generateToken({ id: user._id, email: user.email, rol: user.rol });
      res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
    } catch (error) {
      res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
  }
};

export default authController;