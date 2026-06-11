import { Router } from 'express';
import hospedajeController from '../controllers/hospedajeController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';
import { validate } from '../middlewares/validate.middlewares.js';
import {
    createAccommodationValidator,
    updateAccommodationValidator,
    accommodationIdParamValidator,
} from '../validators/hospedajeValidation.js';

const router = Router();

router.post(
    '/',
    validateJwt,
    authorize(['super_admin']),
    createAccommodationValidator,
    validate,
    hospedajeController.registrar
);

router.get('/', hospedajeController.listarPublico);

router.get(
    '/:id',
    accommodationIdParamValidator,
    validate,
    hospedajeController.obtenerDetalle
);

router.put(
    '/:id',
    validateJwt,
    authorize(['super_admin']),
    accommodationIdParamValidator,
    updateAccommodationValidator,
    validate,
    hospedajeController.actualizar
);

router.delete(
    '/:id',
    validateJwt,
    authorize(['super_admin']),
    accommodationIdParamValidator,
    validate,
    hospedajeController.eliminar
);

export default router;