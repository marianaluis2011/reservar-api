import Reserva from '../models/reserva.js';
import Habitacion from '../models/habitacion.js';

const reservaService = {
  verificarSolapamiento: async (habitacionId, fechaEntrada, fechaSalida) => {
    return await Reserva.findOne({
      habitacion: habitacionId,
      estado: { $ne: 'cancelada' },
      $or: [
        { fechaEntrada: { $lt: fechaSalida }, fechaSalida: { $gt: fechaEntrada } }
      ]
    });
  },

  crear: async (datos) => {
    const { habitacion, fechaEntrada, fechaSalida } = datos;
    
    // 1. Verificar solapamiento
    const solapada = await reservaService.verificarSolapamiento(habitacion, fechaEntrada, fechaSalida);
    if (solapada) throw new Error('La habitación ya está reservada en esas fechas');

    // 2. Validar habitación
    const habitacionDoc = await Habitacion.findById(habitacion);
    if (!habitacionDoc) throw new Error('Habitación no encontrada');
    if (habitacionDoc.estado !== 'activa') throw new Error('Esta habitación no está disponible');

    // 3. Calcular precio
    const diferenciaDias = Math.ceil((new Date(fechaSalida) - new Date(fechaEntrada)) / (1000 * 60 * 60 * 24));
    const precioTotal = diferenciaDias * habitacionDoc.precioPorNoche;

    const nuevaReserva = new Reserva({
      ...datos,
      usuario: datos.usuario || "64f1a2b3c4d5e6f7a8b9c0d1", // Temporal
      precioTotal
    });

    return await nuevaReserva.save();
  },

  listarPorUsuario: async (usuarioId) => {
    return await Reserva.find({ usuario: usuarioId }).populate('hospedaje habitacion');
  }
};

export default reservaService;