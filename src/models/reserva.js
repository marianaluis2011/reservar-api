import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  hospedaje: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospedaje',
    required: true
  },
  habitacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Habitacion',
    required: true
  },
  fechaEntrada: {
    type: Date,
    required: true
  },
  fechaSalida: {
    type: Date,
    required: true
  },
  precioTotal: {
    type: Number,
    required: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
    default: 'pendiente'
  },
  pagoRealizado: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Índice para búsquedas rápidas de disponibilidad
reservaSchema.index({ habitacion: 1, fechaEntrada: 1, fechaSalida: 1 });

const Reserva = mongoose.model('Reserva', reservaSchema);
export default Reserva;