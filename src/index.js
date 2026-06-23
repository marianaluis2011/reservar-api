import express from 'express';
import config from './config/config.js';
import conectarDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import hospedajeRoutes from './routes/accommodation.routes.js';
import habitacionRoutes from './routes/room.routes.js';
import reservaRoutes from './routes/booking.routes.js';
import provinciaRoutes from './routes/province.routes.js';
import usuarioRoutes from './routes/user.routes.js';
import { validateJwt } from './middlewares/validateJwt.js';
import multer from 'multer';
import cors from 'cors';
import { verifyEmailConnection } from "./services/emailService.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

conectarDB();

// ✅ Configuración de CORS (antes de las rutas)
app.use(cors({
  origin: 'http://localhost:5173', // tu frontend en dev
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);

app.get('/api/protected', validateJwt, (  req, res) => {
  res.status(200).json({
    message: '¡Acceso concedido a la ruta protegida!',
    user: req.user
  });
});

app.use('/api/hospedajes', hospedajeRoutes);
app.use('/api/habitaciones', habitacionRoutes);
app.use('/api/provincias', provinciaRoutes);
app.use('/api/reservas', reservaRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Manejo de errores
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: 'Error en la subida de archivos',
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

app.listen(config.port, async () => {
  console.log(`🚀 Servidor de Hospedar corriendo en http://localhost:${config.port}`);

  try {
    await verifyEmailConnection();
  } catch (error) {
    console.error('Falló la conexión SMTP:', error.message);
  }
});
