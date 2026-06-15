import Province from '../models/province.js';

const provinceService = {
  crear: async (data) => {
    return Province.create(data);
  },

  listar: async () => {
    return Province.find().sort({ name: 1 });
  }
};

export default provinceService;