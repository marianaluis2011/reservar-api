import { Router } from 'express';
import provinciaController from '../controllers/provinciaController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.get('/', provinciaController.listar);
router.post('/', validateJwt, authorize(['super_admin']), provinciaController.crear);

export default router;