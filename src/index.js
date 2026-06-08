import express from 'express';
import conectarDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import hospedajeRoutes from './routes/hospedaje.routes.js';
import habitacionRoutes from './routes/habitacion.routes.js';
import reservaRoutes from './routes/reserva.routes.js';
import { validateJwt } from './middlewares/validateJwt.js'; // Importar el middleware de validación JWT
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

// Rutas de Autenticación
app.use('/api/auth', authRoutes);

// Rutas protegidas (ejemplo)
app.get('/api/protected', validateJwt, (req, res) => {
  res.status(200).json({
    mensaje: '¡Acceso concedido a la ruta protegida!',
    usuario: req.user // Información del usuario decodificada del token
  });
});

// Aquí irían tus otras rutas, posiblemente protegidas con validateJwt
// app.use('/api/hospedajes', validateJwt, hospedajeRoutes);
// app.use('/api/habitaciones', validateJwt, habitacionRoutes);
// app.use('/api/reservas', validateJwt, reservaRoutes);

// Middleware para capturar rutas no encontradas y ver qué URL falló
app.use((req, res) => {
  console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.originalUrl || req.url}`);
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de ReservaHost corriendo en http://localhost:${PORT}`);
});
