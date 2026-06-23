import Accommodation from '../models/accommodation.js';
import User from '../models/user.js';

const adminService = {
  getDashboardStats: async () => {
    const [
      totalAccommodations,
      pendingAccommodations,
      approvedAccommodations,
      suspendedAccommodations,
      registeredAdmins,
      registeredUsers,
    ] = await Promise.all([
      Accommodation.countDocuments(),
      Accommodation.countDocuments({ status: 'pendiente' }),
      Accommodation.countDocuments({ status: 'aprobado' }),
      Accommodation.countDocuments({ status: 'suspendido' }),
      User.countDocuments({ role: { $in: ['host', 'super_admin'] } }),
      User.countDocuments(),
    ]);

    return {
      totalAccommodations,
      pendingAccommodations,
      approvedAccommodations,
      suspendedAccommodations,
      registeredAdmins,
      registeredUsers,
    };
  },
};

export default adminService;