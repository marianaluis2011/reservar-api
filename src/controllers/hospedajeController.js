import Hospedaje from '../models/hospedaje.js';
import { cloudinary } from '../config/cloudinary.js';

const hospedajeController = {

  registrar: async (req, res) => {
    try {
      // Capturar URLs de Cloudinary desde req.files
      const imagenPrincipal = req.files?.imagenPrincipal ? req.files.imagenPrincipal[0].path : req.body.imagenPrincipal;
      const galeria = req.files?.galeria ? req.files.galeria.map(file => file.path) : [];

      // Si viene un administrador en el body, lo usamos (útil para super_admin), 
      // si no, se asigna al usuario que crea la petición.
      const adminId = req.body.administrador || req.user.id;

      const nuevoHospedaje = new Hospedaje({
        ...req.body,
        imagenPrincipal,
        galeria,
        administrador: adminId
      });
      await nuevoHospedaje.save();
      res.status(201).json({ message: 'Hospedaje creado con éxito y asignado al administrador', hospedaje: nuevoHospedaje });
    } catch (error) {
      res.status(400).json({ message: 'Error al crear el hospedaje', error: error.message });
    }
  },

  listarPublico: async (req, res) => {
    try {
      const hospedajes = await Hospedaje.find({ estado: 'aprobado' }).populate('provincia', 'nombre');
      res.json(hospedajes);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los hospedajes' });
    }
  },

  obtenerDetalle: async (req, res) => {
    try {
      const hospedaje = await Hospedaje.findById(req.params.id).populate('provincia', 'nombre');
      if (!hospedaje) return res.status(404).json({ message: 'Hospedaje no encontrado' });
      res.json(hospedaje);
    } catch (error) {
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  actualizar: async (req, res) => {
    try {
      const filtro = { _id: req.params.id };
      // Si no es super_admin, solo puede actualizar sus propios hospedajes
      if (req.user.rol !== 'super_admin') {
        filtro.administrador = req.user.id;
      }

      const actualizado = await Hospedaje.findOneAndUpdate(
        filtro,
        req.body,
        { returnDocument: 'after' }
      );
      if (!actualizado) {
        return res.status(404).json({ message: 'Hospedaje no encontrado o no tienes permiso para editarlo' });
      }
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ message: 'Error al actualizar el hospedaje', error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const filtro = { _id: req.params.id };
      // Si no es super_admin, solo puede eliminar sus propios hospedajes
      if (req.user.rol !== 'super_admin') {
        filtro.administrador = req.user.id;
      }

      const hospedaje = await Hospedaje.findOne(filtro);
      if (!hospedaje) return res.status(404).json({ mensaje: 'Hospedaje no encontrado o no tienes permiso' });

      // Función auxiliar para extraer el public_id de la URL
      const extraerPublicId = (url) => {
        const parts = url.split('/');
        const folder = parts[parts.length - 2];
        const fileName = parts[parts.length - 1].split('.')[0];
        return `${folder}/${fileName}`;
      };

      // Eliminar imagen principal de Cloudinary
      await cloudinary.uploader.destroy(extraerPublicId(hospedaje.imagenPrincipal));

      // Eliminar galería de Cloudinary
      if (hospedaje.galeria && hospedaje.galeria.length > 0) {
        const deletionPromises = hospedaje.galeria.map(url => 
          cloudinary.uploader.destroy(extraerPublicId(url))
        );
        await Promise.all(deletionPromises);
      }

      await Hospedaje.deleteOne({ _id: hospedaje._id });

      res.json({ mensaje: 'Hospedaje eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el hospedaje' });
    }
  }
};

export default hospedajeController;