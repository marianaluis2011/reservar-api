import Habitacion from '../models/habitacion.js';
import Hospedaje from '../models/hospedaje.js';

const habitacionController = {

  crear: async (req, res) => {
    try {
      // Seguridad: verificar que el hospedaje pertenezca al admin logueado (o ser super_admin)
      const filtro = { _id: req.body.hospedaje };

      if (req.user.rol !== 'super_admin') {
        filtro.administrador = req.user.id;
      }

      const hospedajePropio = await Hospedaje.findOne(filtro);

      if (!hospedajePropio) {
        return res.status(403).json({ message: 'No tienes permiso para agregar habitaciones a este hospedaje' });
      }

      const imagenes = req.files ? req.files.map(file => file.path) : [];

      const imagenes = req.files ? req.files.map(file => file.path) : [];

      const nuevaHabitacion = new Habitacion({
        ...req.body,
        imagenes
      });
      await nuevaHabitacion.save();

      res.status(201).json({ message: 'Habitación creada con éxito', habitacion: nuevaHabitacion });
    } catch (error) {
      res.status(400).json({ message: 'Error al crear la habitación', error: error.message });
    }
  },

  listarPorHospedaje: async (req, res) => {
    try {
      const { hospedajeId } = req.params;
      const habitaciones = await Habitacion.find({ hospedaje: hospedajeId });
      res.json(habitaciones);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las habitaciones' });
    }
  },

  obtenerDetalle: async (req, res) => {
    try {
      const habitacion = await Habitacion.findById(req.params.id).populate('hospedaje', 'nombre');
      if (!habitacion) return res.status(404).json({ message: 'Habitación no encontrada' });
      res.json(habitacion);
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  actualizar: async (req, res) => {
    try {
      // Buscar la habitación y verificar propiedad a través del hospedaje
      const habitacion = await Habitacion.findById(req.params.id).populate('hospedaje');
      if (!habitacion) return res.status(404).json({ message: 'Habitación no encontrada' });

      if (habitacion.hospedaje.administrador.toString() !== req.user.id && req.user.rol !== 'super_admin') {
        return res.status(403).json({ mensaje: 'No tienes permiso para editar esta habitación' });
      }

      const datosActualizar = { ...req.body };
      if (req.files && req.files.length > 0) {
        datosActualizar.imagenes = req.files.map(file => file.path);
      }

      const actualizada = await Habitacion.findByIdAndUpdate(
        req.params.id, 
        datosActualizar,
        { returnDocument: 'after' }
      );
      res.json(actualizada);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar la habitación', error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const habitacion = await Habitacion.findById(req.params.id).populate('hospedaje');
      if (!habitacion) return res.status(404).json({ message: 'Habitación no encontrada' });

      if (habitacion.hospedaje.administrador.toString() !== req.user.id && req.user.rol !== 'super_admin') {
        return res.status(403).json({ message: 'No tienes permiso para eliminar esta habitación' });
      }

      await Habitacion.findByIdAndDelete(req.params.id);
      res.json({ message: 'Habitación eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ message: 'Error al eliminar la habitación', error: error.message });
    }
  }
};

export default habitacionController;