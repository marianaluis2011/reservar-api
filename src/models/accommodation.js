import mongoose from 'mongoose';

const accommodationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del hospedaje es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede superar los 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [1000, 'La descripción no puede superar los 1000 caracteres']
  },
  province: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Province',
    required: true
  },
  mainImage: {
    type: String,
    required: [true, 'La imagen principal es obligatoria']
  },
  gallery: [String],
  services: [String],
  contactEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  whatsapp: {
    type: String,
    required: [true, 'El número de WhatsApp es necesario para las reservas']
  },
  depositPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado', 'suspendido'],
    default: 'pendiente'
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Accommodation = mongoose.model('Accommodation', accommodationSchema);

export default Accommodation;