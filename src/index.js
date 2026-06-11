import express from 'express';
import config from './config/config.js';
import conectarDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import hospedajeRoutes from './routes/hospedaje.routes.js';
import habitacionRoutes from './routes/habitacion.routes.js';
import reservaRoutes from './routes/reserva.routes.js';
import provinciaRoutes from './routes/provincia.routes.js';
import { validateJwt } from './middlewares/validateJwt.js'; // Importar el middleware de validación JWT

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

// Activamos las rutas de la aplicación
app.use('/api/hospedajes', hospedajeRoutes);
app.use('/api/habitaciones', habitacionRoutes);
app.use('/api/provincias', provinciaRoutes);
app.use('/api/reservas', validateJwt, reservaRoutes); // Las reservas requieren login

// Middleware para capturar rutas no encontradas y ver qué URL falló
app.use((req, res) => {
  console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.originalUrl || req.url}`);
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(err.status || 500).json({
    mensaje: err.message || 'Error interno del servidor'
  });
});

app.listen(config.port, () => {
  console.log(`🚀 Servidor de ReservaHost corriendo en http://localhost:${config.port}`);
});
