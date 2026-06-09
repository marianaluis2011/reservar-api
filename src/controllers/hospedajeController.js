import Hospedaje from '../models/hospedaje.js';
import { registroHospedajeSchema } from '../validators/hospedajeValidation.js';

const hospedajeController = {

  registrar: async (req, res) => {
    try {

      const datosValidados = registroHospedajeSchema.parse(req.body);
      const nuevoHospedaje = new Hospedaje({
        ...datosValidados,
        administrador: req.user.id
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
      const hospedajes = await Hospedaje.find({ estado: 'aprobado' }).populate('provincia', 'nombre');
      res.json(hospedajes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener datos' });
    }
  },


  obtenerDetalle: async (req, res) => {
    try {
      const hospedaje = await Hospedaje.findById(req.params.id).populate('provincia', 'nombre');
      if (!hospedaje) return res.status(404).json({ mensaje: 'No encontrado' });
      res.json(hospedaje);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error en el servidor' });
    }
  },


  actualizar: async (req, res) => {
    try {
      const datosValidados = registroHospedajeSchema.partial().parse(req.body);
      const actualizado = await Hospedaje.findOneAndUpdate(
        { _id: req.params.id },
        datosValidados,
        { returnDocument: 'after' }
      );
      if (!actualizado) return res.status(404).json({ mensaje: 'Hospedaje no encontrado' });
      res.json(actualizado);
    } catch (error) {
      if (error.name === "ZodError") {
        return res.status(400).json({ mensaje: 'Error de validación', errores: error.errors });
      }
      res.status(400).json({ mensaje: 'Error al actualizar', error: error.message });
    }
  }
};

export default hospedajeController;
