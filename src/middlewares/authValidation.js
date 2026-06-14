import { body } from 'express-validator';

export const registerValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .bail()
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .bail()
    .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .bail()
    .isEmail().withMessage('El formato del email es inválido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .bail()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
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

import { body } from 'express-validator';

export const registerValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .bail()
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  body('apellido')
    .notEmpty().withMessage('El apellido es obligatorio')
    .bail()
    .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .bail()
    .isEmail().withMessage('El formato del email es inválido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .bail()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
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