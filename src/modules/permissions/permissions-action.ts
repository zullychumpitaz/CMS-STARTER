import { prisma } from "../database/prisma";

export async function getPermissions() {
  const permissions = await prisma.permission.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
  });

  return permissions;
}

export async function getPermissionsAsOptions() {
  const permissions = await prisma.permission.findMany({
    select: { id: true, name: true },
    where: { deletedAt: null },
    orderBy: { name: "asc" },
  });

  return permissions;
}