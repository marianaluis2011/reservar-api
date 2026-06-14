import { body, param } from 'express-validator';

export const createRoomValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre de la habitación es obligatorio')
    .bail()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .bail()
    .isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  body('capacidadMaxima')
    .notEmpty().withMessage('La capacidad máxima es obligatoria')
    .bail()
    .isInt({ min: 1, max: 50 }).withMessage('La capacidad debe estar entre 1 y 50'),
  body('precioPorNoche')
    .notEmpty().withMessage('El precio por noche es obligatorio')
    .bail()
    .isFloat({ min: 0 }).withMessage('El precio no puede ser negativo'),
  body('hospedaje')
    .notEmpty().withMessage('El ID de hospedaje es obligatorio')
    .bail()
    .isMongoId().withMessage('ID de hospedaje inválido')
];

export const updateRoomValidator = [
  body('nombre').optional()
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('descripcion').optional()
    .isLength({ min: 10, max: 1000 }).withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  body('capacidadMaxima').optional()
    .isInt({ min: 1, max: 50 }).withMessage('La capacidad debe estar entre 1 y 50'),
  body('precioPorNoche').optional()
    .isFloat({ min: 0 }).withMessage('El precio no puede ser negativo'),
  body('estado').optional()
    .isIn(['activa', 'inactiva']).withMessage('Estado inválido')
];

export const roomIdParamValidator = [
  param('id').isMongoId().withMessage('ID de habitación inválido')
];

export const hospedajeIdParamValidator = [
  param('hospedajeId').isMongoId().withMessage('ID de hospedaje inválido')
];