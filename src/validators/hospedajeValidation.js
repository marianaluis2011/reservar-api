import { body, param } from 'express-validator';

export const createAccommodationValidator = [
  body('nombre')
    .notEmpty().withMessage('Falta el campo nombre')
    .bail()
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('descripcion')
    .notEmpty().withMessage('Falta el campo descripción')
    .bail()
    .isLength({ min: 10 }).withMessage('La descripción es demasiado corta'),
  body('provincia')
    .notEmpty().withMessage('Falta el ID de provincia')
    .bail()
    .isMongoId().withMessage('ID de provincia inválido'),
  body('imagenPrincipal')
    .optional()
    .isURL().withMessage('La imagen principal debe ser una URL válida'),
  body('contactoEmail')
    .notEmpty().withMessage('Falta el email de contacto')
    .bail()
    .isEmail().withMessage('El formato del email es inválido'),
  body('telefonoWhatsapp')
    .notEmpty().withMessage('Falta el número de WhatsApp')
    .bail()
    .isLength({ min: 10 }).withMessage('El número de WhatsApp debe tener al menos 10 dígitos'),
  body('porcentajeSena')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El porcentaje de seña debe estar entre 0 y 100'),
  body('servicios')
    .optional()
    .isArray().withMessage('Los servicios deben ser un arreglo'),
  body('administrador')
    .optional()
    .isMongoId().withMessage('ID de administrador inválido'),
];

export const updateAccommodationValidator = [
  body('nombre').optional().isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('descripcion').optional().isLength({ min: 10 }).withMessage('La descripción es demasiado corta'),
  body('provincia').optional().isMongoId().withMessage('ID de provincia inválido'),
  body('imagenPrincipal').optional().isURL().withMessage('La imagen principal debe ser una URL válida'),
  body('contactoEmail').optional().isEmail().withMessage('El formato del email es inválido'),
  body('telefonoWhatsapp').optional().isLength({ min: 10 }).withMessage('El número de WhatsApp debe tener al menos 10 dígitos'),
  body('porcentajeSena').optional().isFloat({ min: 0, max: 100 }).withMessage('El porcentaje de seña debe estar entre 0 y 100'),
  body('servicios').optional().isArray().withMessage('Los servicios deben ser un arreglo'),
  body('administrador').optional().isMongoId().withMessage('ID de administrador inválido'),
];

export const accommodationIdParamValidator = [
  param('id').isMongoId().withMessage('ID de hospedaje inválido'),
];