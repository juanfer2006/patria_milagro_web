import { z } from 'zod';

export const uploadBodySchema = z.object({
  folder: z
    .enum(['cases', 'suspects', 'evidences'], {
      errorMap: () => ({
        message: "El campo folder debe ser 'cases', 'suspects' o 'evidences'",
      }),
    })
    .default('cases'),
});

export type UploadBody = z.infer<typeof uploadBodySchema>;
