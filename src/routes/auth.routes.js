import { Router } from 'express';
import authController from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/authValidation.js';
import { validateResult } from '../middlewares/validateResult.js';

const router = Router();

router.post('/register', registerValidator, validateResult, authController.register);
router.post('/login', loginValidator, validateResult, authController.login);

export default router;