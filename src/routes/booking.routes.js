import { Router } from 'express';
import bookingController from '../controllers/bookingController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { createBookingValidator, bookingIdParamValidator } from '../middlewares/bookingValidation.js';
import { validateResult } from '../middlewares/validateResult.js';
import { authorize } from '../middlewares/authorize.js';  

const router = Router();

router.post('/', validateJwt, createBookingValidator, validateResult, bookingController.crear);
router.post('/owner', validateJwt, authorize(['host']), bookingController.crearPorOwner);
router.get('/owner', validateJwt, authorize(['host']), bookingController.listarPorOwner);
router.get('/', validateJwt, bookingController.listarPorUsuario);
router.get('/:id', validateJwt, bookingIdParamValidator, validateResult, bookingController.obtenerDetalle);
router.patch('/:id/cancelar', validateJwt, bookingIdParamValidator, validateResult, bookingController.cancelar);
router.patch('/:id/confirmar', validateJwt, authorize(['host', 'super_admin']), bookingIdParamValidator, validateResult, bookingController.confirmar);

export default router;