import Hospedaje from '../models/hospedaje.js';

const hospedajeController = {

  registrar: async (req, res) => {
    try {
      const nuevoHospedaje = new Hospedaje({
        ...req.body,
        administrador: req.user.id
      });
      await nuevoHospedaje.save();
      res.status(201).json({ message: 'Hospedaje creado con éxito y asignado al administrador', hospedaje: nuevoHospedaje });
    } catch (error) {
      res.status(400).json({ message: 'Error al crear el hospedaje', error: error.message });
    }
  },

  listarPublico: async (req, res) => {
    try {
      const hospedajes = await Hospedaje.find({ estado: 'aprobado' }).populate('provincia', 'nombre');
      res.json(hospedajes);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los hospedajes' });
    }
  },

  obtenerDetalle: async (req, res) => {
    try {
      const hospedaje = await Hospedaje.findById(req.params.id).populate('provincia', 'nombre');
      if (!hospedaje) return res.status(404).json({ message: 'Hospedaje no encontrado' });
      res.json(hospedaje);
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const actualizado = await Hospedaje.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { returnDocument: 'after' }
      );
      if (!actualizado) {
        return res.status(404).json({ message: 'Hospedaje no encontrado o no tienes permiso para editarlo' });
      }
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar el hospedaje', error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const eliminado = await Hospedaje.findByIdAndDelete(req.params.id);
      if (!eliminado) return res.status(404).json({ message: 'Hospedaje no encontrado o no tienes permiso' });
      res.json({ message: 'Hospedaje eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el hospedaje' });
    }
  }
};

export default hospedajeController;