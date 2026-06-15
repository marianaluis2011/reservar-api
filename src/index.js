import express from 'express';
import config from './config/config.js';
import conectarDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import hospedajeRoutes from './routes/accommodation.routes.js';
import habitacionRoutes from './routes/room.routes.js';
import reservaRoutes from './routes/booking.routes.js';
import provinciaRoutes from './routes/province.routes.js';
import { validateJwt } from './middlewares/validateJwt.js'; // Importar el middleware de validación JWT
import multer from 'multer';
import { verifyEmailConnection, sendTestEmail } from "./services/emailService.js";

const app = express();

conectarDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Petición recibida: ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);

app.get('/api/protected', validateJwt, (req, res) => {
  res.status(200).json({
    message: '¡Acceso concedido a la ruta protegida!',
    usuario: req.user // Información del usuario decodificada del token
  });
});

app.use('/api/hospedajes', hospedajeRoutes);
app.use('/api/habitaciones', habitacionRoutes);
app.use('/api/provincias', provinciaRoutes);
app.use('/api/reservas', validateJwt, reservaRoutes); 

app.use((req, res) => {
  console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.originalUrl || req.url}`);
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      mensaje: 'Error en la subida de archivos',
      error: err.code === 'LIMIT_UNEXPECTED_FILE' 
        ? `Campo inesperado: "${err.field}". Revisa los nombres de los campos de archivos.`
        : err.code === 'LIMIT_FILE_SIZE'
          ? 'El archivo es demasiado grande. El límite permitido es de 2MB.'
          : err.message
    });
  }
  console.error(' Error:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

app.listen(config.port, () => {
  console.log(`🚀 Servidor de ReservaHost corriendo en http://localhost:${config.port}`);
  verifyEmailConnection();
  sendTestEmail();
});
