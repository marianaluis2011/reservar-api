import express from 'express';
import conectarDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import hospedajeRoutes from './routes/hospedaje.routes.js';
import habitacionRoutes from './routes/habitacion.routes.js';
import reservaRoutes from './routes/reserva.routes.js';
import dotenv from 'dotenv';

dotenv.config();


const app = express();

// Conectar a la base de datos MongoDB
conectarDB();

// Middlewares para procesar JSON
app.use(express.json());

// Logger para ver todas las peticiones que llegan
app.use((req, res, next) => {
  console.log(`📥 Petición recibida: ${req.method} ${req.url}`);
  next();
});

// Definición de Rutas
app.use('/api/auth', authRoutes);
app.use('/api/hospedajes', hospedajeRoutes);
app.use('/api/habitaciones', habitacionRoutes);
app.use('/api/reservas', reservaRoutes);

// Middleware para capturar rutas no encontradas y ver qué URL falló
app.use((req, res) => {
  console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.originalUrl || req.url}`);
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de ReservaHost corriendo en http://localhost:${PORT}`);
});
