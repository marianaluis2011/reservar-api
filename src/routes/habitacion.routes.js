import { Router } from 'express';
import habitacionController from '../controllers/habitacionController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';
import { validate } from '../middlewares/validate.middlewares.js';
import {
    createRoomValidator,
    updateRoomValidator,
    roomIdParamValidator,
} from '../validators/habitacionValidation.js';

const router = Router();

router.post(
    '/',
    validateJwt,
    authorize(['admin_hospedaje', 'super_admin']),
    createRoomValidator,
    validate,
    habitacionController.crear
);

router.get('/hospedaje/:hospedajeId', habitacionController.listarPorHospedaje);

router.get(
    '/:id',
    roomIdParamValidator,
    validate,
    habitacionController.obtenerDetalle
);

router.put(
    '/:id',
    validateJwt,
    authorize(['admin_hospedaje', 'super_admin']),
    roomIdParamValidator,
    updateRoomValidator,
    validate,
    habitacionController.actualizar
);

router.delete(
    '/:id',
    validateJwt,
    authorize(['admin_hospedaje', 'super_admin']),
    roomIdParamValidator,
    validate,
    habitacionController.eliminar
);

export default router;