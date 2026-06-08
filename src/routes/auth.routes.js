import { Router } from 'express';
import authController from '../controllers/authController.js';

const router = Router();

router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

export default router;