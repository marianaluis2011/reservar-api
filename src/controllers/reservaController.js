import Reserva from '../models/reserva.js';
import reservaService from '../services/reservaService.js'; // Importar el servicio
import { reservaSchema } from '../validators/reservaValidation.js';

const reservaController = {
  crear: async (req, res) => {
    try {
      const datosValidados = reservaSchema.parse(req.body);

      // Delegamos la lógica compleja (validaciones, cálculo de precio, solapamiento) al servicio
      const nuevaReserva = await reservaService.crear({
        ...datosValidados,
        usuario: req.user.id // El ID del usuario viene del token JWT
      });

      res.status(201).json({ mensaje: 'Reserva creada con éxito', reserva: nuevaReserva });

    } catch (error) {
      // El middleware global de errores (en index.js) manejará los ZodError y otros errores lanzados por el servicio
      throw error; 
    }
  },

  obtenerDetalle: async (req, res) => {
    try {
      const reserva = await Reserva.findOne({ 
        _id: req.params.id, 
        usuario: req.user.id 
      }).populate('hospedaje habitacion');
      
      if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
      res.json(reserva);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener el detalle' });
    }
  },

  cancelar: async (req, res) => {
    try {
      const reserva = await Reserva.findOneAndUpdate(
        { _id: req.params.id, usuario: req.user.id },
        { estado: 'cancelada' },
        { new: true }
      );
      if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada o no tienes permiso' });
      res.json({ mensaje: 'Reserva cancelada correctamente', reserva });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al cancelar la reserva' });
    }
  },

  listarPorUsuario: async (req, res) => {
    try {
      const reservas = await reservaService.listarPorUsuario(req.user.id);
      res.json(reservas);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener reservas' });
    }
  }
};

export default reservaController;