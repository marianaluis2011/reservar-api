import Province from '../models/province.js';

const provinceService = {
  crear: async (data) => {
    return Province.create(data);
  },

  listar: async () => {
    return Province.find().sort({ name: 1 });
  },

  buscarPorNombre: async (nombre) => {
    return Province.findOne({ name: new RegExp(`^${nombre}$`, 'i') });
  }
};

export default provinceService;