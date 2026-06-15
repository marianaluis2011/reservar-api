import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la habitación es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede superar los 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [1000, 'La descripción no puede superar los 1000 caracteres']
  },
  maxCapacity: {
    type: Number,
    required: [true, 'La capacidad máxima es obligatoria'],
    min: 1,
    max: 50
  },
  pricePerNight: {
    type: Number,
    required: [true, 'El precio por noche es obligatorio'],
    min: 0
  },
  services: [String],
  images: [String],
  status: {
    type: String,
    enum: ['activa', 'inactiva'],
    default: 'activa'
  },
  accommodation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation',
    required: true
  }
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);
export default Room;