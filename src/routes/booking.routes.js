import { Router } from 'express';
import bookingController from '../controllers/bookingController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { createBookingValidator, bookingIdParamValidator } from '../middlewares/bookingValidation.js';
import { validateResult } from '../middlewares/validateResult.js';

const router = Router();

router.post('/', validateJwt, createBookingValidator, validateResult, bookingController.crear);
router.get('/:id', validateJwt, bookingIdParamValidator, validateResult, bookingController.obtenerDetalle);
router.get('/', validateJwt, bookingController.listarPorUsuario);
router.patch('/:id/cancelar', validateJwt, bookingIdParamValidator, validateResult, bookingController.cancelar);

export default router;