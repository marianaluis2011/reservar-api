import accommodationService from '../services/accommodationService.js';
import { cloudinary, extraerPublicId } from '../config/cloudinary.js';

const accommodationController = {

  registrar: async (req, res) => {
    try {
      const mainImage = req.files?.mainImage ? req.files.mainImage[0].path : req.body.mainImage;
      const gallery = req.files?.gallery ? req.files.gallery.map(file => file.path) : [];
      const adminId = req.body.admin || req.user.id;

      const newAccommodation = await accommodationService.crear({
        ...req.body,
        mainImage,
        gallery,
        admin: adminId
      });

      res.status(201).json({ message: 'Hospedaje creado con éxito y asignado al administrador', accommodation: newAccommodation });
    } catch (error) {
      res.status(400).json({ message: 'Error al crear el hospedaje', error: error.message });
    }
  },

  listarPublico: async (req, res) => {
    try {
      const accommodations = await accommodationService.listarPublico();
      res.status(200).json(accommodations);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los hospedajes' });
    }
  },

  obtenerDetalle: async (req, res) => {
    try {
      const accommodation = await accommodationService.obtenerPorId(req.params.id);
      if (!accommodation) return res.status(404).json({ message: 'Hospedaje no encontrado' });
      res.status(200).json(accommodation);
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const updated = await accommodationService.actualizar(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: 'Hospedaje no encontrado o no tienes permiso para editarlo' });
      }
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar el hospedaje', error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const filtro = { _id: req.params.id };
      if (req.user.role !== 'super_admin') {
        filtro.admin = req.user.id;
      }

      const accommodation = await accommodationService.buscarUno(filtro);
      if (!accommodation) return res.status(404).json({ message: 'Hospedaje no encontrado o no tienes permiso' });

      await cloudinary.uploader.destroy(extraerPublicId(accommodation.mainImage));

      if (accommodation.gallery && accommodation.gallery.length > 0) {
        const deletionPromises = accommodation.gallery.map(url =>
          cloudinary.uploader.destroy(extraerPublicId(url))
        );
        await Promise.all(deletionPromises);
      }

      await accommodationService.eliminar(accommodation._id);

      res.status(200).json({ message: 'Hospedaje eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el hospedaje' });
    }
  }
};

export default accommodationController;