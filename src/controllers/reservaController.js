import Reserva from '../models/reserva.js';
import Habitacion from '../models/habitacion.js';

const reservaController = {
  crear: async (req, res) => {
    try {
      const { habitacion, hospedaje, fechaEntrada, fechaSalida } = req.body;

      // 1. Obtener la habitación y verificar que pertenezca al hospedaje
      const habitacionDoc = await Habitacion.findById(habitacion);
      if (!habitacionDoc) return res.status(404).json({ message: 'Habitación no encontrada' });

      if (habitacionDoc.hospedaje.toString() !== hospedaje) {
        return res.status(400).json({ message: 'La habitación no pertenece al hospedaje seleccionado' });
      }

      // 2. Verificar si hay reservas que se solapen
      const reservaExistente = await Reserva.findOne({
        habitacion,
        estado: { $ne: 'cancelada' },
        $or: [
          { fechaEntrada: { $lt: fechaSalida }, fechaSalida: { $gt: fechaEntrada } }
        ]
      });

      if (reservaExistente) {
        return res.status(400).json({ message: 'La habitación ya está reservada en esas fechas' });
      }

      if (habitacionDoc.estado !== 'activa') {
        return res.status(400).json({ message: 'Esta habitación no se encuentra activa para reservas' });
      }

      const diferenciaDias = Math.max(1, Math.ceil((new Date(fechaSalida) - new Date(fechaEntrada)) / (1000 * 60 * 60 * 24)));
      const precioTotal = diferenciaDias * habitacionDoc.precioPorNoche;

      const nuevaReserva = new Reserva({
        ...req.body,
        usuario: req.user.id,
        precioTotal
      });

      await nuevaReserva.save();
      res.status(201).json({ message: 'Reserva creada con éxito', reserva: nuevaReserva });

    } catch (error) {
      res.status(500).json({ message: 'Error al procesar la reserva', error: error.message });
    }
  },

  obtenerDetalle: async (req, res) => {
    try {
      const reserva = await Reserva.findOne({
        _id: req.params.id,
        usuario: req.user.id
      }).populate('hospedaje habitacion');

      if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
      res.json(reserva);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el detalle' });
    }
  },

  cancelar: async (req, res) => {
    try {
      const reserva = await Reserva.findOneAndUpdate(
        { _id: req.params.id, usuario: req.user.id },
        { estado: 'cancelada' },
        { new: true }
      );
      if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada o no tienes permiso' });
      res.json({ message: 'Reserva cancelada correctamente', reserva });
    } catch (error) {
      res.status(500).json({ message: 'Error al cancelar la reserva' });
    }
  },

  listarPorUsuario: async (req, res) => {
    try {
      const reservas = await Reserva.find({ usuario: req.user.id }).populate('hospedaje habitacion');
      res.json(reservas);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener reservas' });
    }
  }
};

export default reservaController;