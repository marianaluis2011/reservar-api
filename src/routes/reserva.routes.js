import { Router } from 'express';
import reservaController from '../controllers/reservaController.js';

const router = Router();

router.post('/', reservaController.crear);
router.get('/usuario/:usuarioId', reservaController.listarPorUsuario);

export default router;