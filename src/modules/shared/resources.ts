import { prisma } from "../database/prisma";

export type ResourceKey = "rol" | "usuario" | "post";

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
      await prisma.user.delete({ where: { id } });
    },
  },
  post: {
    label: "permission",
    delete: async (id: string) => {
      await prisma.permission.delete({ where: { id } });
    },
  },
};
