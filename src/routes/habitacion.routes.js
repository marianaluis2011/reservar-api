import { Router } from 'express';
import habitacionController from '../controllers/habitacionController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';
import { createRoomValidator, updateRoomValidator, roomIdParamValidator, hospedajeIdParamValidator } from '../validators/habitacionValidation.js';
import { validateResult } from '../middlewares/validateResult.js';

const router = Router();

// Rutas públicas
router.get('/hospedaje/:hospedajeId', hospedajeIdParamValidator, validateResult, habitacionController.listarPorHospedaje);
router.get('/:id', roomIdParamValidator, validateResult, habitacionController.obtenerDetalle);

// Rutas protegidas
router.post('/', validateJwt, authorize(['admin_hospedaje', 'super_admin']), createRoomValidator, validateResult, habitacionController.crear);
router.put('/:id', validateJwt, authorize(['admin_hospedaje', 'super_admin']), roomIdParamValidator, updateRoomValidator, validateResult, habitacionController.actualizar);
router.delete('/:id', validateJwt, authorize(['admin_hospedaje', 'super_admin']), roomIdParamValidator, validateResult, habitacionController.eliminar);

export default router;