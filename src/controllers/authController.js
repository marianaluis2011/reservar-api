import UserService from '../services/user.services.js';
import { generateToken } from '../libs/jwt.js';

class AuthController {
  static async register(req, res) {
    try {
      const { nombre, apellido, email, password, rol } = req.body;
      if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ mensaje: 'Nombre, apellido, email y contraseña son requeridos.' });
      }
      const existingUser = await UserService.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ mensaje: 'El correo electrónico ya está registrado.' });
      }
      const newUser = await UserService.createUser({ nombre, apellido, email, password, rol });
      const token = generateToken({ id: newUser._id, email: newUser.email, rol: newUser.rol });
      res.status(201).json({ mensaje: 'Usuario registrado exitosamente.', token });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserService.findUserByEmail(email);
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
      }
      const token = generateToken({ id: user._id, email: user.email, rol: user.rol });
      res.status(200).json({ mensaje: 'Inicio de sesión exitoso.', token });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    }
  }
}

export default AuthController;