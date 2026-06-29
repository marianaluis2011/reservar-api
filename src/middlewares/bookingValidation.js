import { body, param } from 'express-validator';

export const createBookingValidator = [
  body('accommodation')
    .notEmpty().withMessage('Falta el ID del hospedaje')
    .bail()
    .isMongoId().withMessage('ID de hospedaje inválido'),
  body('room')
    .notEmpty().withMessage('Falta el ID de la habitación')
    .bail()
    .isMongoId().withMessage('ID de habitación inválido'),
  body('checkIn')
    .notEmpty().withMessage('Falta la fecha de entrada')
    .bail()
    .isISO8601().withMessage('La fecha de entrada debe ser una fecha válida')
    .bail()
    .custom((value) => {
      // value llega como "YYYY-MM-DD". Comparamos por día calendario sin mezclar husos.
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      if (value < todayStr) {
        throw new Error('La fecha de entrada no puede ser en el pasado');
      }
      return true;
    }),
  body('checkOut')
    .notEmpty().withMessage('Falta la fecha de salida')
    .bail()
    .isISO8601().withMessage('La fecha de salida debe ser una fecha válida')
    .bail()
    .custom((value, { req }) => {
      const checkOut = new Date(value);
      const checkIn = new Date(req.body.checkIn);
      if (checkOut <= checkIn) {
        throw new Error('La fecha de salida debe ser posterior a la de entrada');
      }
      return true;
    })
];

export const bookingIdParamValidator = [
  param('id').isMongoId().withMessage('ID de reserva inválido')
];