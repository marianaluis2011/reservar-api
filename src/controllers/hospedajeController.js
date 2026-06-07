import Hospedaje from '../models/hospedaje.js';
import { registroHospedajeSchema } from '../validators/hospedajeValidation.js';

const hospedajeController = {

  registrar: async (req, res) => {
    try {

      const datosValidados = registroHospedajeSchema.parse(req.body);

      // ID de prueba hasta tener el sistema de usuarios
      const nuevoHospedaje = new Hospedaje({
        ...datosValidados,
        administrador: datosValidados.administrador || "64f1a2b3c4d5e6f7a8b9c0d1"
      });

      await nuevoHospedaje.save();
      res.status(201).json({ mensaje: 'Hospedaje registrado y pendiente de aprobación', hospedaje: nuevoHospedaje });
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ mensaje: 'Error de validación', errores: error.errors });
      }
      res.status(400).json({ mensaje: 'Error al registrar', error: error.message });
    }
  },


  listarPublico: async (req, res) => {
    try {
      const hospedajes = await Hospedaje.find({ estado: 'aprobado' });
      res.json(hospedajes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener datos' });
    }
  },


  obtenerDetalle: async (req, res) => {
    try {
      const hospedaje = await Hospedaje.findById(req.params.id);
      if (!hospedaje) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json(hospedaje);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  },


  actualizar: async (req, res) => {
    try {
      // TEMPORAL: Mientras no hay auth, filtramos solo por ID de hospedaje
      // En producción usaremos: { _id: req.params.id, administrador: req.usuario.id }
      const actualizado = await Hospedaje.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { returnDocument: 'after' }
      );
      if (!actualizado) return res.status(404).json({ mensaje: 'Hospedaje no encontrado' });
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ mensaje: 'Error al actualizar' });
    }
  }
};

export default hospedajeController;
