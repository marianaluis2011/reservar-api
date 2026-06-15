import bookingService from '../services/bookingService.js';
import roomService from '../services/roomService.js';
import { sendBookingConfirmationEmail } from "../services/emailService.js";

const bookingController = {
  crear: async (req, res) => {
    try {
      const { room, accommodation, checkIn, checkOut } = req.body;
      const roomDoc = await roomService.obtenerPorId(room);
      if (!roomDoc) return res.status(404).json({ message: 'Habitación no encontrada' });
      if (roomDoc.accommodation._id.toString() !== accommodation) {
        return res.status(400).json({ message: 'La habitación no pertenece al hospedaje seleccionado' });
      }
      const existingBooking = await bookingService.buscarSolapada(room, checkIn, checkOut);
      if (existingBooking) {
        return res.status(400).json({ message: 'La habitación ya está reservada en esas fechas' });
      }
      if (roomDoc.status !== 'activa') {
        return res.status(400).json({ message: 'Esta habitación no se encuentra activa para reservas' });
      }

      const dayDifference = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
      const totalPrice = dayDifference * roomDoc.pricePerNight;
      const newBooking = await bookingService.crear({
        ...req.body,
        user: req.user.id,
        totalPrice
      });
      res.status(201).json({ message: 'Reserva creada con éxito', booking: newBooking });
    } catch (error) {
      res.status(500).json({ message: 'Error al procesar la reserva', error: error.message });
    }
  },
  obtenerDetalle: async (req, res) => {
    try {
      const booking = await bookingService.obtenerDelUsuario(req.params.id, req.user.id);
      if (!booking) return res.status(404).json({ message: 'Reserva no encontrada' });
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el detalle' });
    }
  },
  cancelar: async (req, res) => {
    try {
      const booking = await bookingService.cancelar(req.params.id, req.user.id);
      if (!booking) return res.status(404).json({ message: 'Reserva no encontrada o no tienes permiso' });
      res.status(200).json({ message: 'Reserva cancelada correctamente', booking });
    } catch (error) {
      res.status(500).json({ message: 'Error al cancelar la reserva' });
    }
  },
  listarPorUsuario: async (req, res) => {
    try {
      const bookings = await bookingService.listarPorUsuario(req.user.id);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener reservas' });
    }
  }
};
export default bookingController;