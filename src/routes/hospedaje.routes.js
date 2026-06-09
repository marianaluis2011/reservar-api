import { Router } from 'express';
import hospedajeController from '../controllers/hospedajeController.js';
import { validateJwt } from '../middlewares/validateJwt.js';

const router = Router();

router.post('/', validateJwt, hospedajeController.registrar);
router.get('/', hospedajeController.listarPublico);
router.get('/:id', hospedajeController.obtenerDetalle);
router.put('/:id', validateJwt, hospedajeController.actualizar);

export default router;