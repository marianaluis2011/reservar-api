import { Router } from 'express';
import hospedajeController from '../controllers/hospedajeController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.post('/', validateJwt, authorize(['super_admin']), hospedajeController.registrar);
router.get('/', hospedajeController.listarPublico);
router.get('/:id', hospedajeController.obtenerDetalle);
router.put('/:id', validateJwt, authorize(['super_admin']), hospedajeController.actualizar);
router.delete('/:id', validateJwt, authorize(['super_admin']), hospedajeController.eliminar);

export default router;