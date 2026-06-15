import { Router } from 'express';
import roomController from '../controllers/habitacionController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';
import { createRoomValidator, updateRoomValidator, roomIdParamValidator, accommodationIdParamValidator } from '../middlewares/habitacionValidation.js';
import { validateResult } from '../middlewares/validateResult.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

// Rutas públicas
router.get('/hospedaje/:accommodationId', accommodationIdParamValidator, validateResult, roomController.listarPorHospedaje);
router.get('/:id', roomIdParamValidator, validateResult, roomController.obtenerDetalle);

// Rutas protegidas
router.post(
  '/',
  validateJwt,
  authorize(['host', 'super_admin']),
  upload.array('imagenes', 5),
  createRoomValidator,
  validateResult,
  roomController.crear
);

router.put('/:id', validateJwt, authorize(['host', 'super_admin']), upload.array('imagenes', 5), roomIdParamValidator, updateRoomValidator, validateResult, roomController.actualizar);
router.delete('/:id', validateJwt, authorize(['host', 'super_admin']), roomIdParamValidator, validateResult, roomController.eliminar);

export default router;