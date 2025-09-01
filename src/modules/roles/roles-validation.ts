import z from "zod"
import { prisma } from "../database/prisma"

export const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().min(4, 'La descripción es obligatoria').max(255, 'La descripción no puede tener más de 255 caracteres'),
  slug: z.string().min(4, 'El slug es obligatorio').regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  permissions: z.array(z.string()).min(1, 'Debe seleccionar al menos un permiso.'),
})

export type RoleFormValues = z.infer<typeof roleSchema>

export const roleDeleteSchema = z.object({
  id: z.string(),
})

// Nueva función para validación de unicidad en el servidor
export async function validateRoleUniqueness(data: RoleFormValues) {
    const { id, name, slug } = data;

    // check name
    const nameExists = await prisma.role.findFirst({
        where: {
            name,
            id: id ? { not: id } : undefined,
        }
    });

    if(nameExists) {
        return { field: "name", message: "El nombre del rol ya existe" };
    }

    // check slug
    const slugExists = await prisma.role.findFirst({
        where: {
            slug,
            id: id ? { not: id } : undefined,
        }
    });

    if(slugExists) {
        return { field: "slug", message: "El slug del rol ya existe" };
    }

    return null; // No hay errores de unicidad
}
