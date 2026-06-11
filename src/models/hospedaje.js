import mongoose from 'mongoose';

const hospedajeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del hospedaje es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria']
  },
  provincia: { type: mongoose.Schema.Types.ObjectId, ref: 'Provincia', required: true },
  imagenPrincipal: {
    type: String, // URL de Cloudinary
    required: [true, 'La imagen principal es obligatoria']
  },
  galeria: [String], // Array de URLs de Cloudinary
  servicios: [String], // Ejemplo: ['WiFi', 'Piscina', 'Desayuno']

  // Datos de Contacto y Configuración
  contactoEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  telefonoWhatsapp: {
    type: String,
    required: [true, 'El número de WhatsApp es necesario para las reservas']
  },
  porcentajeSena: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  // Control de Estado y Roles
  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado', 'suspendido'],
    default: 'aprobado'
  },

  // Referencia al Administrador del Hospedaje (Dueño)
  administrador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Asumiendo que tu modelo de usuarios se llama 'Usuario'
    required: true
  }
}, {
  timestamps: true
});

const Hospedaje = mongoose.model('Hospedaje', hospedajeSchema);

export default Hospedaje;