import { Router } from 'express';
import provinceController from '../controllers/provinciaController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';
import { createProvinciaValidator } from '../middlewares/provinciaValidation.js';
import { validateResult } from '../middlewares/validateResult.js';

const router = Router();

router.get('/', provinceController.listar);
router.post('/', validateJwt, authorize(['super_admin']), createProvinciaValidator, validateResult, provinceController.crear);

export default router;