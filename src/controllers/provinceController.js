import provinceService from '../services/provinceService.js';

const provinceController = {
  listar: async (req, res) => {
    try {
      const provinces = await provinceService.listar();
      res.status(200).json(provinces);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener provincias' });
    }
  },

  crear: async (req, res) => {
    try {
      const newProvince = await provinceService.crear(req.body);
      res.status(201).json(newProvince);
    } catch (error) {
      res.status(400).json({ message: 'Error al crear la provincia' });
    }
  }
};

export default provinceController;