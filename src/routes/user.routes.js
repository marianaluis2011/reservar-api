import { Router } from 'express';
import userController from '../controllers/userController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.get('/', validateJwt, authorize(['super_admin']), userController.obtenerTodos);
router.patch('/:id/estado', validateJwt, authorize(['super_admin']), userController.cambiarEstado);

export default router;