import Habitacion from '../models/habitacion.js';

const habitacionService = {
  crear: async (datos) => {
    const nuevaHabitacion = new Habitacion(datos);
    return await nuevaHabitacion.save();
  },

  listarPorHospedaje: async (hospedajeId) => {
    return await Habitacion.find({ hospedaje: hospedajeId });
  },

  obtenerDetalle: async (id) => {
    return await Habitacion.findById(id).populate('hospedaje', 'nombre');
  },

  actualizar: async (id, datos) => {
    return await Habitacion.findByIdAndUpdate(id, datos, { returnDocument: 'after' });
  },

  eliminar: async (id) => {
    return await Habitacion.findByIdAndDelete(id);
  }
};

export default habitacionService;