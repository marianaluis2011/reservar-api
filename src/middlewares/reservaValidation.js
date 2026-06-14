import { body, param } from 'express-validator';

export const createBookingValidator = [
  body('hospedaje')
    .notEmpty().withMessage('Falta el ID del hospedaje')
    .bail()
    .isMongoId().withMessage('ID de hospedaje inválido'),
  body('habitacion')
    .notEmpty().withMessage('Falta el ID de la habitación')
    .bail()
    .isMongoId().withMessage('ID de habitación inválido'),
  body('fechaEntrada')
    .notEmpty().withMessage('Falta la fecha de entrada')
    .bail()
    .isISO8601().withMessage('La fecha de entrada debe ser una fecha válida')
    .bail()
    .custom((value) => {
      const checkIn = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkIn < today) {
        throw new Error('La fecha de entrada no puede ser en el pasado');
      }
      return true;
    }),
  body('fechaSalida')
    .notEmpty().withMessage('Falta la fecha de salida')
    .bail()
    .isISO8601().withMessage('La fecha de salida debe ser una fecha válida')
    .bail()
    .custom((value, { req }) => {
      const checkOut = new Date(value);
      const checkIn = new Date(req.body.fechaEntrada);
      if (checkOut <= checkIn) {
        throw new Error('La fecha de salida debe ser posterior a la de entrada');
      }
      return true;
    })
];

export const bookingIdParamValidator = [
  param('id').isMongoId().withMessage('ID de reserva inválido')
];