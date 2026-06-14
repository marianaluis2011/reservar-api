import { body, param } from 'express-validator';
import { body, param } from 'express-validator';

export const createRoomValidator = [
  body('nombre')
    .notEmpty().withMessage('El nombre de la habitación es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
  body('descripcion')
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
  body('capacidadMaxima')
    .isInt({ min: 1 }).withMessage('La capacidad debe ser al menos 1'),
  body('precioPorNoche')
    .isFloat({ min: 0 }).withMessage('El precio no puede ser negativo'),
  body('hospedaje')
    .isMongoId().withMessage('ID de hospedaje inválido')
];

export const updateRoomValidator = [
  body('nombre').optional().isLength({ min: 3 }),
  body('capacidadMaxima').optional().isInt({ min: 1 }),
  body('precioPorNoche').optional().isFloat({ min: 0 }),
  body('estado').optional().isIn(['activa', 'inactiva']).withMessage('Estado inválido')
];

export const roomIdParamValidator = [
  param('id').isMongoId().withMessage('ID de habitación inválido')
];

export const hospedajeIdParamValidator = [
  param('hospedajeId').isMongoId().withMessage('ID de hospedaje inválido')
];
