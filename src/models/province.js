import mongoose from "mongoose";

const provinceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la provincia es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre no puede superar los 50 caracteres']
  }
}, { timestamps: true });

const Province = mongoose.model('Province', provinceSchema);
export default Province;