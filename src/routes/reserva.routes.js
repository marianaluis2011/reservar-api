import { Router } from 'express';
import reservaController from '../controllers/reservaController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { validate } from '../middlewares/validate.middlewares.js';
import {
  createBookingValidator,
  bookingIdParamValidator,
} from '../validators/reservaValidation.js';

const router = Router();

router.post(
  '/',
  validateJwt,
  createBookingValidator,
  validate,
  reservaController.crear
);

router.get('/', validateJwt, reservaController.listarPorUsuario);

router.get(
  '/:id',
  validateJwt,
  bookingIdParamValidator,
  validate,
  reservaController.obtenerDetalle
);

router.patch(
  '/:id/cancelar',
  validateJwt,
  bookingIdParamValidator,
  validate,
  reservaController.cancelar
);

export default router;