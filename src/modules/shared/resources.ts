import { prisma } from "../database/prisma";

export type ResourceKey = "rol" | "usuario" | "permission";

type ResourceConfig = {
  label: string; // cómo se muestra en la UI
  delete: (id: string) => Promise<void>; // cómo eliminar en Prisma
};

export const RESOURCES: Record<ResourceKey, ResourceConfig> = {
  rol: {
    label: "rol",
    delete: async (id: string) => {
      await prisma.role.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
    },
  },
  usuario: {
    label: "user",
    delete: async (id: string) => {
      await prisma.user.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } })
    },
  },
  permission: {
    label: "permission",
    delete: async (id: string) => {
      await prisma.permission.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } })
    },
  },
};
