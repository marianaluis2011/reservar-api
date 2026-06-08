import { Router } from 'express';
import habitacionController from '../controllers/habitacionController.js';

const router = Router();

router.post('/', habitacionController.crear);
router.get('/hospedaje/:hospedajeId', habitacionController.listarPorHospedaje);
router.get('/:id', habitacionController.obtenerDetalle);
router.put('/:id', habitacionController.actualizar);
router.delete('/:id', habitacionController.eliminar);

export default router;