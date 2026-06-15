import { Router } from 'express';
import accommodationController from '../controllers/hospedajeController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';
import { createAccommodationValidator, updateAccommodationValidator, accommodationIdParamValidator } from '../middlewares/hospedajeValidation.js';
import { validateResult } from '../middlewares/validateResult.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

// Rutas públicas
router.get('/', accommodationController.listarPublico);
router.get('/:id', accommodationIdParamValidator, validateResult, accommodationController.obtenerDetalle);

// Rutas protegidas
router.post(
  '/',
  validateJwt,
  authorize(['super_admin']),
  upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'gallery', maxCount: 5 }]),
  createAccommodationValidator,
  validateResult,
  accommodationController.registrar
);

router.put(
  '/:id',
  validateJwt,
  authorize(['host', 'super_admin']),
  upload.fields([{ name: 'mainImage', maxCount: 1 }, { name: 'gallery', maxCount: 5 }]),
  accommodationIdParamValidator,
  updateAccommodationValidator,
  validateResult,
  accommodationController.actualizar
);

router.delete('/:id', validateJwt, authorize(['host', 'super_admin']), accommodationIdParamValidator, validateResult, accommodationController.eliminar);

export default router;