import { Router } from 'express';
import hospedajeController from '../controllers/hospedajeController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';
import { createAccommodationValidator, updateAccommodationValidator, accommodationIdParamValidator } from '../validators/hospedajeValidation.js';
import { validateResult } from '../middlewares/validateResult.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

// Rutas públicas
// Rutas públicas
router.get('/', hospedajeController.listarPublico);
router.get('/:id', accommodationIdParamValidator, validateResult, hospedajeController.obtenerDetalle);

// Rutas protegidas
router.post(
  '/', 
  validateJwt, 
  authorize(['super_admin']), 
  upload.fields([{ name: 'imagenPrincipal', maxCount: 1 }, { name: 'galeria', maxCount: 5 }]),
  createAccommodationValidator, 
  validateResult, 
  hospedajeController.registrar
);

router.put(
  '/:id', 
  validateJwt, 
  authorize(['admin_hospedaje', 'super_admin']), 
  upload.fields([{ name: 'imagenPrincipal', maxCount: 1 }, { name: 'galeria', maxCount: 5 }]),
  accommodationIdParamValidator, 
  updateAccommodationValidator, 
  validateResult, 
  hospedajeController.actualizar
);

router.delete('/:id', validateJwt, authorize(['admin_hospedaje', 'super_admin']), accommodationIdParamValidator, validateResult, hospedajeController.eliminar);

export default router;