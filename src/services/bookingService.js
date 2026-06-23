import Booking from '../models/booking.js';

const bookingService = {
  crear: async (data) => {
    return Booking.create(data);
  },

  findOverlapping: async (room, checkIn, checkOut) => {
    return Booking.findOne({
      room: room,
      status: { $ne: 'cancelada' },
      $or: [
        { checkIn: { $lt: checkOut }, checkOut: { $gt: checkIn } }
      ]
    });
  },

  obtenerDelUsuario: async (id, userId) => {
    return Booking.findOne({ _id: id, user: userId }).populate('accommodation room');
  },

  listarPorUsuario: async (userId) => {
    return Booking.find({ user: userId }).populate('accommodation room');
  },

  obtenerPorId: async (id) => {
    return Booking.findById(id)
      .populate('user', 'fullName email')
      .populate('accommodation room');
  },

  cancelar: async (id, userId) => {
    return Booking.findOneAndUpdate(
      { _id: id, user: userId },
      { status: 'cancelada' },
      { new: true }
    );
  },
  confirmar: async (id) => {
    return Booking.findByIdAndUpdate(
      id,
      { status: 'confirmada' },
      { new: true }
    ).populate('user', 'fullName email')
      .populate('accommodation room');
  },
};

export default bookingService;