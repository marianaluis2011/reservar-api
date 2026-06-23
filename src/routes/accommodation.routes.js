import { Router } from 'express';
import accommodationController from '../controllers/accommodationController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';
import { createAccommodationValidator, updateAccommodationValidator, accommodationIdParamValidator } from '../middlewares/accommodationValidation.js';
import { validateResult } from '../middlewares/validateResult.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

router.get('/', accommodationController.listarPublico);

router.get(
  '/admin/todos',
  validateJwt,
  authorize(['super_admin']),
  accommodationController.listarTodos
);

router.patch(
  '/:id/aprobar',
  validateJwt,
  authorize(['super_admin']),
  accommodationIdParamValidator,
  validateResult,
  accommodationController.aprobar
);

router.patch(
  '/:id/estado',
  validateJwt,
  authorize(['super_admin']),
  accommodationIdParamValidator,
  validateResult,
  accommodationController.cambiarEstado
);

router.get(
  '/:id',
  accommodationIdParamValidator,
  validateResult,
  accommodationController.obtenerDetalle
);

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

router.delete(
  '/:id',
  validateJwt,
  authorize(['host', 'super_admin']),
  accommodationIdParamValidator,
  validateResult,
  accommodationController.eliminar
);

export default router;