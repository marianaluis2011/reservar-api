import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
    // se guarda hasheada; el hash lo hace el controller con bcrypt
  },
  rol: {
    type: String,
    enum: ['cliente', 'admin_hospedaje', 'super_admin'],
    default: 'cliente'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false  // el flujo de verificación es para más adelante (SMTP)
  },
  deleted: {
    type: Boolean,
    default: false  // soft delete
  }
}, {
  timestamps: true  // crea createdAt y updatedAt
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;