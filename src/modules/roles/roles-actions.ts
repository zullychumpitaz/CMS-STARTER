"use server";

import { prisma } from "../database/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth/auth";
import { logAction } from "../logs/logs-actions";
import { accionesLog } from "../logs/logs-types";
import { getPermissionByName } from "../permissions/permissions-action";

export async function getRoles() {
  const session = await auth();
  const userRole = session?.user?.rol;

  const whereClause: { deletedAt?: Date | null } = {};
  if (userRole !== "Super Administrador") {
    whereClause.deletedAt = null;
  }

  return await prisma.role.findMany({
    where: whereClause,
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

export async function getRolesDB() {
  return await prisma.role.findMany({
    include: {
      permissions: {
        select: { permissionId: true },
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
  if (!session || !session.user || !session.user.id) {
    throw new Error("User session not found.");
  }
  const { name, description, slug, permissions } = data;

  if (!name) throw new Error("El nombre es obligatorio.");

  try {
    const role = await prisma.role.create({
      data: { name, description, slug},
    });

    const rolePermissionsData = permissions!.map((permissionId) => ({
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
      performedBy: session.user.id,
      details: { reason: "Rol creado desde CMS" },
    });
    
  } catch (error) {
    console.log(error);
    await logAction({
      action: accionesLog.CREATE,
      entity: "Rol",
      performedBy: session.user.id,
      details: { reason: error instanceof Error ? error.message : String(error) },
    });
  }
}

export async function updateRole(id: string, data: RoleInput) {
  const { name, description, slug, permissions } = data;
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User session not found.");
  }

  if (!id) throw new Error("ID de rol no proporcionado");
  if (!name) throw new Error("El nombre es obligatorio.");

  try {
    // 1. Actualizar los datos del rol
    const rol = await prisma.role.update({
      where: { id },
      data: { name, description, slug },
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
      performedBy: session.user.id,
      details: { reason: "Rol modificado desde CMS" },
    });

    revalidatePath("/roles");

  } catch (error) {
    await logAction({
      action: accionesLog.EDIT,
      entity: "Rol",
      performedBy: session.user.id,
      details: { reason: error instanceof Error ? error.message : String(error) },
    });
  }
}

export async function getRoleById(id: string) {
    const session = await auth();
    const userRole = session?.user?.rol;

    const whereClause: { id: string, deletedAt?: Date | null } = { id };
    if (userRole !== "Super Administrador") {
        whereClause.deletedAt = null;
    }

  return prisma.role.findUnique({
    where: whereClause,
    include: {
      permissions: {
        select: { permissionId: true },
      },
    },
  });
}

export async function getRoleByName(name: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User session not found.");
  }
  if (!name) throw new Error("Nombre del rol requerido.");

  try {
    const role = await prisma.role.findUnique({
      where: { name: name },
      include: {
        permissions: {
          select: { permissionId: true },
        },
      },
    });
    return role;
  } catch (error) {
    console.error("Error al obtener el rol por nombre:", error);
    throw new Error("No se pudo obtener el rol.");
  }
}

export async function deleteRole(roleId: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("User session not found.");
  }
  if (!roleId) throw new Error("ID del rol requerido.");

  try {
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
      performedBy: session.user.id,
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
      performedBy: session.user.id,
      details: { reason: error instanceof Error ? error.message : String(error) },
    });
    throw new Error("No se pudo eliminar el rol.");
  }
}

export async function restoreRole(roleId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("User session not found.");
    }
    if (!roleId) throw new Error("ID del rol requerido.");

    try {
        await prisma.role.update({
            where: { id: roleId },
            data: {
                deletedAt: null,
                isActive: true,
            },
        });

        await logAction({
            action: accionesLog.EDIT, // o una nueva acción RESTORE si existe
            entity: "Rol",
            entityId: roleId,
            performedBy: session.user.id,
            details: { reason: "Rol restaurado desde CMS" },
        });

        revalidatePath("/roles");
        return { success: true };
    } catch (error) {
        console.error("Error al restaurar el rol:", error);
        await logAction({
            action: accionesLog.EDIT,
            entity: "Rol",
            entityId: roleId,
            performedBy: session.user.id,
            details: { reason: error instanceof Error ? error.message : String(error) },
        });
        throw new Error("No se pudo restaurar el rol.");
    }
}

export async function havePermission(roleId: string, permission: string) {
  const rol = await getRoleById(roleId);
  const perm = await getPermissionByName( permission )
  if(!rol) return false;
  return rol.permissions.some(p => p.permissionId === perm?.id);
}