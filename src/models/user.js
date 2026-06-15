import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'El nombre completo es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede superar los 100 caracteres']
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
  },
  role: {
    type: String,
    enum: ['guest', 'host', 'super_admin'],
    default: 'guest'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;