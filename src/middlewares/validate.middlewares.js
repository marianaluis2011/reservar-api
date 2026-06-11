import { validationResult } from 'express-validator';

// Middleware que corre después de las cadenas de validación.
// Si alguna validación falló, devuelve 400 con la lista de errores.
// Si todo pasó, deja seguir al controller.
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Error de validación',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }

    next();
};