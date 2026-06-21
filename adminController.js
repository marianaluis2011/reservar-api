import adminService from '../services/adminService.js';

const adminController = {
  /**
   * Controlador para obtener las estadísticas del dashboard del super administrador.
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   */
  getDashboardStats: async (req, res) => {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: error.message || 'Error al obtener las estadísticas del dashboard.' });
    }
  },
};

export default adminController;