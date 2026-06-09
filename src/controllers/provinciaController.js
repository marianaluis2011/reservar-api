import Provincia from '../models/provincia.js';

const provinciaController = {
  listar: async (req, res) => {
    try {
      const provincias = await Provincia.find().sort({ nombre: 1 });
      res.json(provincias);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener provincias' });
    }
  },

  crear: async (req, res) => {
    try {
      const nuevaProvincia = new Provincia(req.body);
      await nuevaProvincia.save();
      res.status(201).json(nuevaProvincia);
    } catch (error) {
      res.status(400).json({ mensaje: 'Error al crear la provincia' });
    }
  }
};

export default provinciaController;