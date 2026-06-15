import { Router } from 'express';
import provinceController from '../controllers/provinceController.js';
import { validateJwt } from '../middlewares/validateJwt.js';
import { authorize } from '../middlewares/authorize.js';
import { createProvinciaValidator } from '../middlewares/provinceValidation.js';
import { validateResult } from '../middlewares/validateResult.js';

const router = Router();

router.get('/', provinceController.listar);
router.post('/', validateJwt, authorize(['super_admin']), createProvinciaValidator, validateResult, provinceController.crear);

export default router;