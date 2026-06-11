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
    .isFloat({ min: 0 }).withMessage('El precio por noche no puede ser negativo'),
  body('hospedaje')
    .notEmpty().withMessage('Falta el ID del hospedaje')
    .bail()
    .isMongoId().withMessage('ID de hospedaje inválido'),
  body('servicios')
    .optional()
    .isArray().withMessage('Los servicios deben ser un arreglo'),
  body('imagenes')
    .optional()
    .isArray().withMessage('Las imágenes deben ser un arreglo'),
  body('imagenes.*')
    .optional()
    .isURL().withMessage('Cada imagen debe ser una URL válida'),
  body('estado')
    .optional()
    .isIn(['activa', 'inactiva']).withMessage('El estado debe ser activa o inactiva'),
];

export const updateRoomValidator = [
  body('nombre').optional().isLength({ min: 3 }).withMessage('El nombre de la habitación debe tener al menos 3 caracteres'),
  body('descripcion').optional().isLength({ min: 10 }).withMessage('La descripción es demasiado corta'),
  body('capacidadMaxima').optional().isInt({ min: 1 }).withMessage('La capacidad mínima debe ser 1 persona'),
  body('precioPorNoche').optional().isFloat({ min: 0 }).withMessage('El precio por noche no puede ser negativo'),
  body('hospedaje').optional().isMongoId().withMessage('ID de hospedaje inválido'),
  body('servicios').optional().isArray().withMessage('Los servicios deben ser un arreglo'),
  body('imagenes').optional().isArray().withMessage('Las imágenes deben ser un arreglo'),
  body('imagenes.*').optional().isURL().withMessage('Cada imagen debe ser una URL válida'),
  body('estado').optional().isIn(['activa', 'inactiva']).withMessage('El estado debe ser activa o inactiva'),
];

export const roomIdParamValidator = [
  param('id').isMongoId().withMessage('ID de habitación inválido'),
];