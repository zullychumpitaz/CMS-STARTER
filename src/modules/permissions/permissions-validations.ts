import z from "zod"

export const permissionSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().min(4, 'La descripción es obligatoria').max(255, 'La descripción no puede tener más de 255 caracteres'),
  category: z.enum(['create', 'edit', 'delete', 'view', 'special'], { message: 'La categoría es obligatoria' })
})

export type PermissionFormValues = z.infer<typeof permissionSchema>