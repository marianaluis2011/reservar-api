import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    // Salir del proceso con error
    process.exit(1);
  }
};

export default conectarDB;