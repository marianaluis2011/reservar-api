import Hospedaje from '../models/hospedaje.js';

const hospedajeController = {

  registrar: async (req, res) => {
    try {
      // Capturar URLs de Cloudinary desde req.files
      const imagenPrincipal = req.files?.imagenPrincipal ? req.files.imagenPrincipal[0].path : req.body.imagenPrincipal;
      const galeria = req.files?.galeria ? req.files.galeria.map(file => file.path) : [];

      const nuevoHospedaje = new Hospedaje({
        ...req.body,
        imagenPrincipal,
        galeria,
        administrador: req.user.id // En una PR anterior definimos que solo super_admin crea, pero podemos asignar admin
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
      const filtro = { _id: req.params.id };
      // Si no es super_admin, solo puede actualizar sus propios hospedajes
      if (req.user.rol !== 'super_admin') {
        filtro.administrador = req.user.id;
      }

      const actualizado = await Hospedaje.findOneAndUpdate(
        filtro,
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
      const filtro = { _id: req.params.id };
      // Si no es super_admin, solo puede eliminar sus propios hospedajes
      if (req.user.rol !== 'super_admin') {
        filtro.administrador = req.user.id;
      }

      const eliminado = await Hospedaje.findOneAndDelete(filtro);
      if (!eliminado) return res.status(404).json({ message: 'Hospedaje no encontrado o no tienes permiso' });
      res.json({ message: 'Hospedaje eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el hospedaje' });
    }
  }
};

export default hospedajeController;