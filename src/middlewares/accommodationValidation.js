import { body, param } from 'express-validator';

export const createAccommodationValidator = [
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .bail()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('description')
    .notEmpty().withMessage('La descripción es obligatoria')
    .bail()
    .isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  body('province')
    .notEmpty().withMessage('Falta el ID de provincia')
    .bail()
    .isMongoId().withMessage('ID de provincia inválido'),
  body('mainImage')
    .optional()
    .isURL().withMessage('La imagen principal debe ser una URL válida'),
  body('contactEmail')
    .notEmpty().withMessage('Falta el email de contacto')
    .bail()
    .isEmail().withMessage('El formato del email es inválido'),
  body('whatsapp')
    .notEmpty().withMessage('Falta el número de WhatsApp')
    .bail()
    .isLength({ min: 10, max: 20 }).withMessage('El número de WhatsApp debe tener entre 10 y 20 dígitos'),
  body('depositPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El porcentaje de seña debe estar entre 0 y 100'),
  body('services')
    .optional()
    .isArray().withMessage('Los servicios deben ser un arreglo'),
  body('admin')
    .optional()
    .isMongoId().withMessage('ID de administrador inválido')
];

export const updateAccommodationValidator = [
  body('name').optional()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('description').optional()
    .isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  body('province').optional()
    .isMongoId().withMessage('ID de provincia inválido'),
  body('mainImage').optional()
    .isURL().withMessage('La imagen principal debe ser una URL válida'),
  body('contactEmail').optional()
    .isEmail().withMessage('El formato del email es inválido'),
  body('whatsapp').optional()
    .isLength({ min: 10, max: 20 }).withMessage('El número de WhatsApp debe tener entre 10 y 20 dígitos'),
  body('depositPercentage').optional()
    .isFloat({ min: 0, max: 100 }).withMessage('El porcentaje de seña debe estar entre 0 y 100'),
  body('services').optional()
    .isArray().withMessage('Los servicios deben ser un arreglo'),
  body('admin').optional()
    .isMongoId().withMessage('ID de administrador inválido')
];

export const accommodationIdParamValidator = [
  param('id').isMongoId().withMessage('ID de hospedaje inválido')
];