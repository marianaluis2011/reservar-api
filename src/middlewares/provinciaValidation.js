import { body, param } from 'express-validator';

export const createProvinciaValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre de la provincia es obligatorio')
    .bail()
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
];

export const provinciaIdParamValidator = [param('id').isMongoId().withMessage('ID de provincia inválido')];