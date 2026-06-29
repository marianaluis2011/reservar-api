import Room from '../models/room.js';

const roomService = {
  crear: async (data) => {
    return Room.create(data);
  },

  listarPorAccommodation: async (accommodationId) => {
    return Room.find({ accommodation: accommodationId });
  },

  obtenerPorId: async (id) => {
    return Room.findById(id).populate('accommodation', 'name');
  },

  obtenerConAccommodation: async (id) => {
    return Room.findById(id).populate('accommodation');
  },

  actualizar: async (id, data) => {
    return Room.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  },

  eliminar: async (id) => {
    return Room.findByIdAndDelete(id);
  },

  listarMasBaratas: async (limit = 5) => {
    return Room.find({ status: 'activa' })
      .sort({ pricePerNight: 1 })
      .limit(limit)
      .populate('accommodation', 'name');
  },

  listarMasCaras: async (limit = 5) => {
    return Room.find({ status: 'activa' })
      .sort({ pricePerNight: -1 })
      .limit(limit)
      .populate('accommodation', 'name');
  }
};

export default roomService;