import { body } from 'express-validator';

export const registerValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .bail()
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .bail()
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres'),
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .bail()
    .isEmail().withMessage('El formato del email es inválido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .bail()
    .isLength({ min: 6, max: 64 }).withMessage('La contraseña debe tener entre 6 y 64 caracteres'),
  body('rol').optional()
    .isIn(['cliente', 'admin_hospedaje', 'super_admin']).withMessage('Rol inválido')
];

export const loginValidator = [
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .bail()
    .isEmail().withMessage('El formato del email es inválido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
];