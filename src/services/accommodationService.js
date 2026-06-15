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

  eliminar: async (id) => {
    return Accommodation.deleteOne({ _id: id });
  }
};

export default accommodationService;