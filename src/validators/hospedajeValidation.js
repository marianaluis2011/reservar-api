import { z } from 'zod';

export const registroHospedajeSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().min(10, "La descripción es demasiado corta"),
  ubicacion: z.string().min(5, "La ubicación es requerida"),
  imagenPrincipal: z.string().url("La imagen principal debe ser una URL válida de Cloudinary"),
  contactoEmail: z.string().email("El formato del email es inválido"),
  telefonoWhatsapp: z.string().min(10, "El número de WhatsApp debe tener al menos 10 dígitos"),
  porcentajeSena: z.number().min(0).max(100).optional(),
  servicios: z.array(z.string()).optional(),
  administrador: z.string().optional() // Temporal hasta tener JWT
});
