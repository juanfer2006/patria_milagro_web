import { z } from 'zod';

export const registerBodySchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre no puede exceder 80 caracteres'),
  email: z
    .string({ required_error: 'El correo electrónico es obligatorio' })
    .trim()
    .toLowerCase()
    .email('El formato del correo electrónico no es válido'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(72, 'La contraseña no puede exceder 72 caracteres')
    .regex(/[a-zA-Z]/, 'La contraseña debe contener al menos una letra')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;

export const loginBodySchema = z.object({
  email: z
    .string({ required_error: 'El correo electrónico es obligatorio' })
    .trim()
    .toLowerCase()
    .email('El formato del correo electrónico no es válido'),
  password: z
    .string({ required_error: 'La contraseña es obligatoria' })
    .min(1, 'La contraseña no puede estar vacía'),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
