import { Router } from 'express';
import habitacionController from '../controllers/habitacionController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.post('/', validateJwt, authorize(['admin_hospedaje', 'super_admin']), habitacionController.crear);
router.get('/hospedaje/:hospedajeId', habitacionController.listarPorHospedaje);
router.get('/:id', habitacionController.obtenerDetalle);
router.put('/:id', validateJwt, authorize(['admin_hospedaje', 'super_admin']), habitacionController.actualizar);
router.delete('/:id', validateJwt, authorize(['admin_hospedaje', 'super_admin']), habitacionController.eliminar);

export default router;