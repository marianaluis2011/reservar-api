import { body } from 'express-validator';

export const registerValidator = [
  body('fullName')
    .notEmpty().withMessage('El nombre completo es obligatorio')
    .bail()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .bail()
    .isEmail().withMessage('El formato del email es inválido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .bail()
    .isLength({ min: 8, max: 64 }).withMessage('La contraseña debe tener entre 8 y 64 caracteres'),
body('role').optional()
  .isIn(['guest', 'host']).withMessage('Rol inválido')
];

export const loginValidator = [
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .bail()
    .isEmail().withMessage('El formato del email es inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];