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

  listarTodos: async () => {
    return Accommodation.find().populate('admin', 'fullName email');
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