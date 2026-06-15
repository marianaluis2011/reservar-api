import Province from '../models/provincia.js';

const provinceController = {
  listar: async (req, res) => {
    try {
      const provinces = await Province.find().sort({ name: 1 });
      res.status(200).json(provinces);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener provincias' });
    }
  },

  crear: async (req, res) => {
    try {
      const newProvince = new Province(req.body);
      await newProvince.save();
      res.status(201).json(newProvince);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear la provincia' });
    }
  }
};

export default provinceController;