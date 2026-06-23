import userService from '../services/userService.js';
import accommodationService from '../services/accommodationService.js';

const userController = {
  crearAdmin: async (req, res) => {
    try {
      const { fullName, email, password } = req.body;
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
      }
      const user = await userService.createUser({ fullName, email, password, role: 'host' });
      res.status(201).json({
        message: 'Administrador creado correctamente',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear administrador', error: error.message });
    }
  },

  obtenerTodos: async (req, res) => {
    try {
      const users = await userService.obtenerTodos();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  },

  cambiarEstado: async (req, res) => {
    try {
      const { isActive } = req.body;
      const user = await userService.cambiarEstado(req.params.id, isActive);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      const estado = isActive ? 'habilitado' : 'deshabilitado';
      res.status(200).json({ message: `Usuario ${estado} correctamente`, user });
    } catch (error) {
      res.status(500).json({ message: 'Error al cambiar el estado del usuario' });
    }
  },
};

export default userController;