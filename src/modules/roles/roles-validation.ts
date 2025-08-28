import z from "zod"

export const roleSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().min(4, 'La descripción es obligatoria').max(255, 'La descripción no puede tener más de 255 caracteres'),
  slug: z.string().min(4, 'El slug es obligatorio').regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  permissions: z.array(z.string()).optional(),
})

export type RoleFormValues = z.infer<typeof roleSchema>