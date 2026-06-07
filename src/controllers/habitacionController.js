import Habitacion from '../models/habitacion.js';
import { habitacionSchema } from '../validators/habitacionValidation.js';

const habitacionController = {

  crear: async (req, res) => {
    try {
      const datosValidados = habitacionSchema.parse(req.body);
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
      const actualizada = await Habitacion.findByIdAndUpdate(
        req.params.id,
        datosValidados,
        { returnDocument: 'after' }
      );
      if (!actualizada) return res.status(404).json({ mensaje: 'Habitación no encontrada' });
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
      const eliminada = await Habitacion.findByIdAndDelete(req.params.id);
      if (!eliminada) return res.status(404).json({ mensaje: 'Habitación no encontrada' });
      res.json({ mensaje: 'Habitación eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ mensaje: 'Error al eliminar', error: error.message });
    }
  }
};

export default habitacionController;