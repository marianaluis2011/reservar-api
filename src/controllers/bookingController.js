import bookingService from '../services/bookingService.js';
import roomService from '../services/roomService.js';
import accommodationService from '../services/accommodationService.js';
import {
  sendBookingCreatedEmail,
  sendBookingCancelledEmail,
  sendBookingConfirmedEmail,
} from "../services/emailService.js";
import userService from '../services/userService.js';

const bookingController = {
  listarPorOwner: async (req, res) => {
    try {
      const accommodation = await accommodationService.obtenerPorAdmin(req.user.id);

      if (!accommodation) {
        return res.status(404).json({ message: 'No tienes un hospedaje asignado' });
      }

      const bookings = await bookingService.listarPorAccommodation(accommodation._id);
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las reservas del hospedaje' });
    }
  },

  crearPorOwner: async (req, res) => {
    try {
      const { guestEmail, guestName, room, checkIn, checkOut } = req.body;
      if (!guestEmail || !room || !checkIn || !checkOut) {
        return res.status(400).json({ message: 'Faltan datos para crear la reserva' });
      }
      const guest = await userService.findUserByEmail(guestEmail);
      const accommodation = await accommodationService.obtenerPorAdmin(req.user.id);
      if (!accommodation) {
        return res.status(404).json({ message: 'No tienes un hospedaje asignado' });
      }
      const roomDoc = await roomService.obtenerConAccommodation(room);
      if (!roomDoc) {
        return res.status(404).json({ message: 'Habitación no encontrada' });
      }
      if (roomDoc.accommodation._id.toString() !== accommodation._id.toString()) {
        return res.status(403).json({ message: 'No tienes permiso para reservar esta habitación' });
      }
      if (roomDoc.status !== 'activa') {
        return res.status(400).json({ message: 'Esta habitación no se encuentra activa para reservas' });
      }
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkOutDate <= checkInDate) {
        return res.status(400).json({ message: 'La fecha de salida debe ser posterior a la de entrada' });
      }
      const existingBooking = await bookingService.findOverlapping(room, checkIn, checkOut);
      if (existingBooking) {
        return res.status(400).json({ message: 'La habitación ya está reservada en esas fechas' });
      }
      const nights = Math.max(
        1,
        Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      );
      const totalPrice = nights * roomDoc.pricePerNight;
      const isRegisteredGuest = guest && guest.role === 'guest';
      const newBooking = await bookingService.crear({
        user: isRegisteredGuest ? guest._id : undefined,
        guestEmail,
        guestName: guestName || guest?.fullName,
        accommodation: accommodation._id,
        room,
        checkIn,
        checkOut,
        totalPrice,
        status: 'pendiente'
      });
      const bookingWithDetails = await bookingService.obtenerPorId(newBooking._id);
      let emailSent = false;
      try {
        await sendBookingCreatedEmail(bookingWithDetails);
        emailSent = true;
      } catch (error) {
        emailSent = false;
      }
      res.status(201).json({
        message: 'Reserva creada correctamente y quedó pendiente de aprobación',
        booking: bookingWithDetails,
        emailSent
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
    }
  },

  crear: async (req, res) => {
    try {
      const { room, accommodation, checkIn, checkOut } = req.body;
      const roomDoc = await roomService.obtenerPorId(room);
      if (!roomDoc) {
        return res.status(404).json({ message: 'Habitación no encontrada' });
      }
      if (roomDoc.accommodation._id.toString() !== accommodation) {
        return res.status(400).json({ message: 'La habitación no pertenece al hospedaje seleccionado' });
      }
      const existingBooking = await bookingService.findOverlapping(room, checkIn, checkOut);
      if (existingBooking) {
        return res.status(400).json({ message: 'La habitación ya está reservada en esas fechas' });
      }
      if (roomDoc.status !== 'activa') {
        return res.status(400).json({ message: 'Esta habitación no se encuentra activa para reservas' });
      }
      const dayDifference = Math.max(
        1,
        Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
      );
      const totalPrice = dayDifference * roomDoc.pricePerNight;
      const newBooking = await bookingService.crear({
        ...req.body,
        user: req.user.id,
        totalPrice
      });
      const bookingWithDetails = await bookingService.obtenerPorId(newBooking._id);
      let emailSent = false;
      try {
        await sendBookingCreatedEmail(bookingWithDetails);
        emailSent = true;
      } catch (error) {
        emailSent = false;
      }
      res.status(201).json({
        message: 'Reserva creada con éxito',
        booking: newBooking,
        emailSent
      });
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
  confirmar: async (req, res) => {
    try {
      const booking = await bookingService.obtenerPorId(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }
      if (req.user.role !== 'super_admin' && booking.accommodation.admin.toString() !== req.user.id) {
        return res.status(403).json({ message: 'No tienes permiso para confirmar esta reserva' });
      }
      if (!['pendiente', 'cancelada'].includes(booking.status)) {
        return res.status(400).json({
          message: 'Solo se pueden confirmar reservas pendientes o reactivar reservas canceladas'
        });
      }
      const confirmed = await bookingService.confirmar(req.params.id);
      let emailSent = false;
      try {
        await sendBookingConfirmedEmail(confirmed);
        emailSent = true;
      } catch (error) {
        emailSent = false;
      }
      const message =
        booking.status === 'cancelada'
          ? 'Reserva reactivada correctamente'
          : 'Reserva confirmada correctamente';
      const confirmedBooking = await bookingService.confirmar(req.params.id);
      res.status(200).json({
        message,
        booking: confirmedBooking
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al confirmar la reserva' });
    }
  },

  cancelar: async (req, res) => {
    try {
      const booking = await bookingService.obtenerPorId(req.params.id);

      if (!booking) {
        return res.status(404).json({ message: 'Reserva no encontrada' });
      }

      const bookingUserId = booking.user?._id?.toString() || booking.user?.toString();
      const accommodationAdminId = booking.accommodation?.admin?._id?.toString() || booking.accommodation?.admin?.toString();

      const isBookingOwner = bookingUserId === req.user.id;
      const isAccommodationOwner = accommodationAdminId === req.user.id;
      const isSuperAdmin = req.user.role === 'super_admin';

      if (!isBookingOwner && !isAccommodationOwner && !isSuperAdmin) {
        return res.status(403).json({ message: 'No tienes permiso para cancelar esta reserva' });
      }

      if (booking.status === 'cancelada') {
        return res.status(400).json({ message: 'La reserva ya se encuentra cancelada' });
      }

      const cancelledBooking = await bookingService.cancelarPorId(req.params.id);

      let emailSent = false;

      try {
        await sendBookingCancelledEmail(cancelledBooking);
        emailSent = true;
      } catch (error) {
        emailSent = false;
      }

      res.status(200).json({
        message: 'Reserva cancelada correctamente',
        booking: cancelledBooking,
        emailSent
      });
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
  },

  fechasOcupadas: async (req, res) => {
    try {
      const fechas = await bookingService.listarOcupadasPorRoom(req.params.roomId);
      res.status(200).json(fechas);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener fechas ocupadas' });
    }
  }
};
export default bookingController;