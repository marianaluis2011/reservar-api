import Accommodation from '../models/accommodation.js';

const accommodationService = {
  crear: async (data) => {
    return Accommodation.create(data);
  },

  listarPublico: async () => {
    return Accommodation.find({ status: 'aprobado' }).populate('province', 'name');
  },

  obtenerPorId: async (id) => {
    return Accommodation.findById(id).populate('province', 'name');
  },

  buscarUno: async (filtro) => {
    return Accommodation.findOne(filtro);
  },

  obtenerPorAdmin: async (adminId) => {
    return Accommodation.findOne({ admin: adminId })
      .populate('province', 'name')
      .populate('admin', 'fullName email');
  },

  actualizar: async (id, data) => {
    return Accommodation.findOneAndUpdate({ _id: id }, data, { returnDocument: 'after' });
  },

  aprobar: async (id) => {
    return Accommodation.findByIdAndUpdate(
      id,
      { status: 'aprobado' },
      { new: true }
    ).populate('admin', 'fullName email');
  },

  listarTodos: async ({ page = 1, limit = 10 } = {}) => {
    const currentPage = parseInt(page);
    const perPage = parseInt(limit);
    const skip = (currentPage - 1) * perPage;

    const [accommodations, total] = await Promise.all([
      Accommodation.find()
        .populate('province', 'name')
        .populate('admin', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage),
      Accommodation.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / perPage);

    return {
      accommodations,
      pagination: {
        total,
        totalPages,
        currentPage,
        perPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    };
  },

  cambiarEstado: async (id, status) => {
    return Accommodation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  },

  eliminar: async (id) => {
    return Accommodation.deleteOne({ _id: id });
  }
};

export default accommodationService;