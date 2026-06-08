import { Router } from 'express';
import hospedajeController from '../controllers/hospedajeController.js';

const router = Router();

router.post('/', hospedajeController.registrar);
router.get('/', hospedajeController.listarPublico);
router.get('/:id', hospedajeController.obtenerDetalle);
router.put('/:id', hospedajeController.actualizar);

export default router;