import mongoose from 'mongoose';

const habitacionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la habitación es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  capacidadMaxima: {
    type: Number,
    required: [true, 'La capacidad máxima es obligatoria'],
    min: 1
  },
  precioPorNoche: {
    type: Number,
    required: [true, 'El precio por noche es obligatorio'],
    min: 0
  },
  servicios: [String],
  imagenes: [String], // Falta URL de Cloudinary
  estado: {
    type: String,
    enum: ['activa', 'inactiva'],
    default: 'activa'
  },
  hospedaje: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospedaje',
    required: true
  }
}, { timestamps: true });

const Habitacion = mongoose.model('Habitacion', habitacionSchema);
export default Habitacion;