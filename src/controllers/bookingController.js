import Booking from '../models/booking.js';
import Room from '../models/room.js';

const bookingController = {
  crear: async (req, res) => {
    try {
      const { room, accommodation, checkIn, checkOut } = req.body;

      // 1. Obtener la habitación y verificar que pertenezca al hospedaje
      const roomDoc = await Room.findById(room);
      if (!roomDoc) return res.status(404).json({ message: 'Habitación no encontrada' });

      if (roomDoc.accommodation.toString() !== accommodation) {
        return res.status(400).json({ message: 'La habitación no pertenece al hospedaje seleccionado' });
      }

      // 2. Verificar si hay reservas que se solapen
      const existingBooking = await Booking.findOne({
        room,
        status: { $ne: 'cancelada' },
        $or: [
          { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
        ]
      });

      if (existingBooking) {
        return res.status(400).json({ message: 'La habitación ya está reservada en esas fechas' });
      }

      if (roomDoc.status !== 'activa') {
        return res.status(400).json({ message: 'Esta habitación no se encuentra activa para reservas' });
      }

      const dayDifference = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
      const totalPrice = dayDifference * roomDoc.pricePerNight;

      const newBooking = new Booking({
        ...req.body,
        user: req.user.id,
        totalPrice
      });

      await newBooking.save();
      res.status(201).json({ message: 'Reserva creada con éxito', booking: newBooking });

    } catch (error) {
      res.status(500).json({ message: 'Error al procesar la reserva', error: error.message });
    }
  },

  obtenerDetalle: async (req, res) => {
    try {
      const booking = await Booking.findOne({
        _id: req.params.id,
        user: req.user.id
      }).populate('accommodation room');

      if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el detalle' });
    }
  },

  cancelar: async (req, res) => {
    try {
      const booking = await Booking.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { status: 'cancelada' },
        { new: true }
      );
      if (!booking) return res.status(404).json({ message: 'Reserva no encontrada o no tienes permiso' });
      res.status(200).json({ message: 'Reserva cancelada correctamente', booking });
    } catch (error) {
      res.status(500).json({ message: 'Error al cancelar la reserva' });
    }
  },

  listarPorUsuario: async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user.id }).populate('accommodation room');
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener reservas' });
    }
  }
};

export default bookingController;