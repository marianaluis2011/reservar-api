import { z } from 'zod';

export const habitacionSchema = z.object({
  nombre: z.string().min(3, "El nombre de la habitación debe tener al menos 3 caracteres"),
  descripcion: z.string().min(10, "La descripción es demasiado corta"),
  capacidadMaxima: z.number().min(1, "La capacidad mínima debe ser 1 persona"),
  precioPorNoche: z.number().min(0, "El precio por noche no puede ser negativo"),
  servicios: z.array(z.string()).optional(),
  imagenes: z.array(z.string().url("Cada imagen debe ser una URL válida")).optional(),
  estado: z.enum(['activa', 'inactiva']).optional(),
  hospedaje: z.string().regex(/^[0-9a-fA-F]{24}$/, "El ID del hospedaje no es válido")
});
