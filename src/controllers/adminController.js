import adminService from '../services/adminService.js';

const adminController = {
  getStats: async (req, res) => {
    try {
      const stats = await adminService.getDashboardStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({
        message: 'Error al obtener las métricas del panel',
        error: error.message,
      });
    }
  },
};

export default adminController;