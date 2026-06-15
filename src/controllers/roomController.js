import roomService from '../services/roomService.js';
import accommodationService from '../services/accommodationService.js';

const roomController = {

  crear: async (req, res) => {
    try {
      const filtro = { _id: req.body.accommodation };
      if (req.user.role !== 'super_admin') {
        filtro.admin = req.user.id;
      }

      const ownAccommodation = await accommodationService.buscarUno(filtro);
      if (!ownAccommodation) {
        return res.status(403).json({ message: 'No tienes permiso para agregar habitaciones a este hospedaje' });
      }

      const images = req.files ? req.files.map(file => file.path) : [];

      const newRoom = await roomService.crear({
        ...req.body,
        images
      });

      res.status(201).json({ message: 'Habitación creada con éxito', room: newRoom });
    } catch (error) {
      res.status(400).json({ message: 'Error al crear la habitación', error: error.message });
    }
  },

  listarPorHospedaje: async (req, res) => {
    try {
      const { accommodationId } = req.params;
      const rooms = await roomService.listarPorAccommodation(accommodationId);
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las habitaciones' });
    }
  },

  obtenerDetalle: async (req, res) => {
    try {
      const room = await roomService.obtenerPorId(req.params.id);
      if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const room = await roomService.obtenerConAccommodation(req.params.id);
      if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });

      if (room.accommodation.admin.toString() !== req.user.id && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'No tienes permiso para editar esta habitación' });
      }

      const dataToUpdate = { ...req.body };
      if (req.files && req.files.length > 0) {
        dataToUpdate.images = req.files.map(file => file.path);
      }

      const updated = await roomService.actualizar(req.params.id, dataToUpdate);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar la habitación', error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const room = await roomService.obtenerConAccommodation(req.params.id);
      if (!room) return res.status(404).json({ message: 'Habitación no encontrada' });

      if (room.accommodation.admin.toString() !== req.user.id && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'No tienes permiso para eliminar esta habitación' });
      }

      await roomService.eliminar(req.params.id);
      res.status(200).json({ message: 'Habitación eliminada correctamente' });
    } catch (error) {
      res.status(400).json({ message: 'Error al eliminar la habitación', error: error.message });
    }
  }
};

export default roomController;