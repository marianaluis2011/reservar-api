import { Router } from 'express';
import reservaController from '../controllers/reservaController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { createBookingValidator, bookingIdParamValidator } from '../validators/reservaValidation.js';
import { validateResult } from '../middlewares/validateResult.js';

const router = Router();

// Todas estas rutas ya están protegidas por `validateJwt` en `index.js`

router.post('/', createBookingValidator, validateResult, reservaController.crear);
router.get('/:id', bookingIdParamValidator, validateResult, reservaController.obtenerDetalle);
router.get('/', reservaController.listarPorUsuario);
router.patch('/:id/cancelar', bookingIdParamValidator, validateResult, reservaController.cancelar);

export default router;