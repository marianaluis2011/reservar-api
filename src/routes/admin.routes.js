import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.get(
  '/stats',
  validateJwt,
  authorize(['super_admin']),
  adminController.getStats
);

export default router;