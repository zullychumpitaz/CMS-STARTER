"use server";

import { prisma } from "../database/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth/auth";
import { logAction } from "../logs/logs-actions";
import { accionesLog } from "../logs/logs-types";

export async function getRoles() {
  return await prisma.role.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      description: true,
      updatedAt: true,
      deletedAt: true,
      _count: {
        select: { users: true }, // 👈 contador de usuarios con ese rol
      },
      users: {
        select: { id: true },
      },
      permissions: {
        select: {
          permission: {
            select: {
              id: true,
              name: true,
              category: true,
              description: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

type RoleInput = {
  name: string;
  description: string;
  slug: string;
  permissions?: string[];
};

export async function createRole(data: RoleInput) {
  const session = await auth();
  const { name, description, slug, permissions } = data;

  if (!name) throw new Error("El nombre es obligatorio.");

  try {
    const role = await prisma.role.create({
      data: { name, description, slug },
    });

    // 2. Relacionar permisos (si se seleccionaron)
    if (permissions && permissions.length > 0) {
      const rolePermissionsData = permissions.map((permissionId) => ({
        roleId: role.id,
        permissionId: permissionId.toString(),
      }));

      await prisma.rolePermission.createMany({
        data: rolePermissionsData,
      });

      await logAction({
        action: accionesLog.CREATE,
        entity: "Rol",
        entityId: role.id,
        performedBy: session?.user.id!,
        details: { reason: "Rol creado desde CMS" },
      });
    }
  } catch (error) {
    console.log(error);
    await logAction({
      action: accionesLog.CREATE,
      entity: "Rol",
      performedBy: session?.user.id!,
      details: { reason: error },
    });
  }
}

export async function updateRole(id: string, data: RoleInput) {
  const { name, permissions } = data;
  const session = await auth();

  if (!id) throw new Error("ID de rol no proporcionado");
  if (!name) throw new Error("El nombre es obligatorio.");

  try {
    // 1. Actualizar el nombre del rol
    const rol = await prisma.role.update({
      where: { id, deletedAt: null },
      data: { name },
    });

    // 2. Eliminar permisos actuales del rol
    await prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    // 3. Agregar los nuevos permisos
    if (permissions && permissions.length > 0) {
      const rolePermissionsData = permissions.map((permissionId) => ({
        roleId: id,
        permissionId: permissionId.toString(),
      }));

      await prisma.rolePermission.createMany({
        data: rolePermissionsData,
      });
    }

    await logAction({
      action: accionesLog.EDIT,
      entity: "Rol",
      entityId: rol.id,
      performedBy: session?.user.id!,
      details: { reason: "Rol modificado desde CMS" },
    });
  } catch (error) {
    await logAction({
      action: accionesLog.EDIT,
      entity: "Rol",
      performedBy: session?.user.id!,
      details: { reason: error },
    });
  }
}

export async function getRoleById(id: string) {
  return prisma.role.findUnique({
    where: { id, deletedAt: null },
    include: {
      permissions: {
        select: { permissionId: true },
      },
    },
  });
}

export async function deleteRole(roleId: string) {
  const session = await auth();
  if (!roleId) throw new Error("ID del rol requerido.");

  try {
    // Eliminar los permisos relacionados al rol
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    // Eliminación lógica del rol
    await prisma.role.update({
      where: { id: roleId },
      data: {
        deletedAt: new Date(),
      },
    });

    await logAction({
      action: accionesLog.DELETE,
      entity: "Rol",
      entityId: roleId,
      performedBy: session?.user.id!,
      details: { reason: "Rol eliminado desde CMS" },
    });

    revalidatePath("/roles");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar el rol:", error);
    await logAction({
      action: accionesLog.DELETE,
      entity: "Rol",
      entityId: roleId,
      performedBy: session?.user.id!,
      details: { reason: error },
    });
    throw new Error("No se pudo eliminar el rol.");
  }
}
