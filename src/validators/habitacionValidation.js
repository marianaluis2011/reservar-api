import { body, param } from 'express-validator';

export const createRoomValidator = [
  body('nombre')
    .notEmpty().withMessage('Falta el campo nombre')
    .bail()
    .isLength({ min: 3 }).withMessage('El nombre de la habitación debe tener al menos 3 caracteres'),
  body('descripcion')
    .notEmpty().withMessage('Falta el campo descripción')
    .bail()
    .isLength({ min: 10 }).withMessage('La descripción es demasiado corta'),
  body('capacidadMaxima')
    .notEmpty().withMessage('Falta la capacidad máxima')
    .bail()
    .isInt({ min: 1 }).withMessage('La capacidad mínima debe ser 1 persona'),
  body('precioPorNoche')
    .notEmpty().withMessage('Falta el precio por noche')
    .bail()
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo')
];

export const updateRoomValidator = [
  body('nombre').optional()
    .isLength({ min: 3 }).withMessage('El nombre de la habitación debe tener al menos 3 caracteres'),
  body('descripcion').optional()
    .isLength({ min: 10 }).withMessage('La descripción es demasiado corta'),
  body('capacidadMaxima').optional()
    .isInt({ min: 1 }).withMessage('La capacidad mínima debe ser 1 persona'),
  body('precioPorNoche').optional()
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('estado').optional()
    .isIn(['activa', 'inactiva', 'mantenimiento']).withMessage('Estado de habitación inválido')
];

export const roomIdParamValidator = [
  param('id').isMongoId().withMessage('ID de habitación inválido')
];