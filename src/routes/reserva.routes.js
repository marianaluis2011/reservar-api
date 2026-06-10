import { Router } from 'express';
import reservaController from '../controllers/reservaController.js';
import { validateJwt } from '../middlewares/validateJwt.js';

const router = Router();

router.post('/', validateJwt, reservaController.crear);
router.get('/', validateJwt, reservaController.listarPorUsuario);
router.get('/:id', validateJwt, reservaController.obtenerDetalle);
router.patch('/:id/cancelar', validateJwt, reservaController.cancelar);

export default router;