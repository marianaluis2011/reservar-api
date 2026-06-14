import { Router } from 'express';
import AuthController from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/authValidation.js';
import { validateResult } from '../middlewares/validateResult.js';

const router = Router();

router.post('/register', registerValidator, validateResult, AuthController.register);
router.post('/login', loginValidator, validateResult, AuthController.login);

export default router;