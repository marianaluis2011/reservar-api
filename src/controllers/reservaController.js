import Reserva from '../models/reserva.js';
import Habitacion from '../models/habitacion.js';
import { reservaSchema } from '../validators/reservaValidation.js';

const reservaController = {
  crear: async (req, res) => {
    try {
      const datosValidados = reservaSchema.parse(req.body);
      const { habitacion, fechaEntrada, fechaSalida } = datosValidados;

      // Validar que la fecha de entrada no sea anterior a hoy (normalizando a medianoche)
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      const fechaEntradaDate = new Date(fechaEntrada);
      fechaEntradaDate.setHours(0, 0, 0, 0);

      if (fechaEntradaDate < hoy) {
        return res.status(400).json({ mensaje: 'No puedes reservar en fechas pasadas' });
      }

      // 1. Verificar si hay reservas que se solapen
      const reservaExistente = await Reserva.findOne({
        habitacion,
        estado: { $ne: 'cancelada' }, // Ignorar las canceladas
        $or: [
          { fechaEntrada: { $lt: fechaSalida }, fechaSalida: { $gt: fechaEntrada } }
        ]
      });

      if (reservaExistente) {
        return res.status(400).json({ mensaje: 'La habitación ya está reservada en esas fechas' });
      }

      // 2. Obtener datos de la habitación
      const habitacionDoc = await Habitacion.findById(habitacion);
      if (!habitacionDoc) return res.status(404).json({ mensaje: 'Habitación no encontrada' });
      
      if (habitacionDoc.estado !== 'activa') {
        return res.status(400).json({ mensaje: 'Esta habitación no está disponible actualmente' });
      }

      const diferenciaDias = Math.ceil((new Date(fechaSalida) - new Date(fechaEntrada)) / (1000 * 60 * 60 * 24));
      const precioTotal = diferenciaDias * habitacionDoc.precioPorNoche;

      const nuevaReserva = new Reserva({
        ...datosValidados,
        usuario: req.user.id, // Usamos el ID del token JWT
        precioTotal
      });

      await nuevaReserva.save();
      res.status(201).json({ mensaje: 'Reserva creada con éxito', reserva: nuevaReserva });

    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ mensaje: 'Error de validación', errores: error.errors });
      }
      res.status(500).json({ mensaje: 'Error al procesar la reserva', error: error.message });
    }
  },

  listarPorUsuario: async (req, res) => {
    try {
      const reservas = await Reserva.find({ usuario: req.params.usuarioId }).populate('hospedaje habitacion');
      res.json(reservas);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener reservas' });
    }
  }
};

export default reservaController;