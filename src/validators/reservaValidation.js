import { z } from 'zod';

const baseReservaSchema = z.object({
  hospedaje: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de hospedaje inválido"),
  habitacion: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de habitación inválido"),
  fechaEntrada: z.string().pipe(z.coerce.date()),
  fechaSalida: z.string().pipe(z.coerce.date()),
  usuario: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de usuario inválido").optional(), // Temporal hasta JWT
});

export const reservaSchema = baseReservaSchema.refine((data) => data.fechaSalida > data.fechaEntrada, {
  message: "La fecha de salida debe ser posterior a la de entrada",
  path: ["fechaSalida"],
});

export const checkDisponibilidadSchema = baseReservaSchema.pick({ habitacion: true, fechaEntrada: true, fechaSalida: true });