import express from 'express';
import conectarDB from './config/db.js';
import hospedajeController from './controllers/hospedajeController.js';
import habitacionController from './controllers/habitacionController.js';
import reservaController from './controllers/reservaController.js';
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

// Definición de Rutas de Hospedajes
// Nota: Para 'registrar' y 'actualizar', el controlador espera que exista 'req.usuario.id'
// En el futuro, aquí deberás agregar un middleware de autenticación (JWT)
app.post('/api/hospedajes', hospedajeController.registrar);
app.get('/api/hospedajes', hospedajeController.listarPublico);
app.get('/api/hospedajes/:id', hospedajeController.obtenerDetalle);
app.put('/api/hospedajes/:id', hospedajeController.actualizar);

// Rutas de Habitaciones
app.post('/api/habitaciones', habitacionController.crear);
app.get('/api/habitaciones/hospedaje/:hospedajeId', habitacionController.listarPorHospedaje);
app.get('/api/habitaciones/:id', habitacionController.obtenerDetalle);
app.put('/api/habitaciones/:id', habitacionController.actualizar);
app.delete('/api/habitaciones/:id', habitacionController.eliminar);

// Rutas de Reservas
app.post('/api/reservas', reservaController.crear);
app.get('/api/reservas/usuario/:usuarioId', reservaController.listarPorUsuario);

// Middleware para capturar rutas no encontradas y ver qué URL falló
app.use((req, res) => {
  console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.originalUrl || req.url}`);
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor de ReservaHost corriendo en http://localhost:${PORT}`);
});
