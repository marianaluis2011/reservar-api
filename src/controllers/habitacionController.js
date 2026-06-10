import Habitacion from '../models/habitacion.js';
import Hospedaje from '../models/hospedaje.js';
import { habitacionSchema } from '../validators/habitacionValidation.js';

const habitacionController = {

  crear: async (req, res) => {
    try {
      const datosValidados = habitacionSchema.parse(req.body);

      // Seguridad: Verificar que el hospedaje pertenezca al admin logueado
      const hospedajePropio = await Hospedaje.findOne({ 
        _id: datosValidados.hospedaje, 
        administrador: req.user.id 
      });

      if (!hospedajePropio) {
        return res.status(403).json({ mensaje: 'No tienes permiso para agregar habitaciones a este hospedaje' });
      }

      const nuevaHabitacion = new Habitacion(datosValidados);
      await nuevaHabitacion.save();
      
      res.status(201).json({ mensaje: 'Habitación creada con éxito', habitacion: nuevaHabitacion });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ mensaje: 'Error de validación', errores: error.errors });
      }
      res.status(400).json({ mensaje: 'Error al crear la habitación', error: error.message });
    }
  },


  listarPorHospedaje: async (req, res) => {
    try {
      const { hospedajeId } = req.params;
      const habitaciones = await Habitacion.find({ hospedaje: hospedajeId });
      res.json(habitaciones);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener las habitaciones' });
    }
  },


  obtenerDetalle: async (req, res) => {
    try {
      const habitacion = await Habitacion.findById(req.params.id).populate('hospedaje', 'nombre');
      if (!habitacion) return res.status(404).json({ mensaje: 'Habitación no encontrada' });
      res.json(habitacion);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  },


  actualizar: async (req, res) => {
    try {
      const datosValidados = habitacionSchema.partial().parse(req.body);
      
      // Buscamos la habitación y verificamos propiedad a través del hospedaje
      const habitacion = await Habitacion.findById(req.params.id).populate('hospedaje');
      if (!habitacion) return res.status(404).json({ mensaje: 'Habitación no encontrada' });

      if (habitacion.hospedaje.administrador.toString() !== req.user.id && req.user.rol !== 'super_admin') {
        return res.status(403).json({ mensaje: 'No tienes permiso para editar esta habitación' });
      }

      const actualizada = await Habitacion.findByIdAndUpdate(
        req.params.id, 
        datosValidados,
        { returnDocument: 'after' }
      );
      res.json(actualizada);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ mensaje: 'Error de validación', errores: error.errors });
      }
      res.status(400).json({ mensaje: 'Error al actualizar', error: error.message });
    }
  },


  eliminar: async (req, res) => {
    try {
      const habitacion = await Habitacion.findById(req.params.id).populate('hospedaje');
      if (!habitacion) return res.status(404).json({ mensaje: 'Habitación no encontrada' });

      if (habitacion.hospedaje.administrador.toString() !== req.user.id && req.user.rol !== 'super_admin') {
        return res.status(403).json({ mensaje: 'No tienes permiso para eliminar esta habitación' });
      }

      await Habitacion.findByIdAndDelete(req.params.id);
      res.json({ mensaje: 'Habitación eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ mensaje: 'Error al eliminar', error: error.message });
    }
  }
};

export default habitacionController;