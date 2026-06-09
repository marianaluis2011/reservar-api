import mongoose from "mongoose";

const provinciaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la provincia es obligatorio'],
    trim: true
  }
}, { timestamps: true });

const Provincia = mongoose.model('Provincia', provinciaSchema);
export default Provincia;