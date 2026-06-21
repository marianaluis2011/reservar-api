import Accommodation from '../models/accommodation.js'; // Asume que tienes este modelo
import User from '../models/user.js'; // Asume que tienes este modelo

const adminService = {
  /**
   * Obtiene estadísticas generales para el dashboard del super administrador.
   * @returns {Promise<Object>} Un objeto con el total de hospedajes, pendientes, aprobados y administradores.
   */
  getDashboardStats: async () => {
    try {
      const totalAccommodations = await Accommodation.countDocuments();
      const pendingAccommodations = await Accommodation.countDocuments({ status: 'pendiente' });
      const approvedAccommodations = await Accommodation.countDocuments({ status: 'aprobado' });
      const totalAdmins = await User.countDocuments({ role: 'admin' }); // Asume que los admins tienen el rol 'admin'

      return {
        total: totalAccommodations,
        pending: pendingAccommodations,
        approved: approvedAccommodations,
        admins: totalAdmins,
      };
    } catch (error) {
      console.error("Error en adminService.getDashboardStats:", error);
      throw new Error('No se pudieron obtener las estadísticas del dashboard.');
    }
  },
};

export default adminService;