import userService from '../services/userService.js';

const userController = {
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