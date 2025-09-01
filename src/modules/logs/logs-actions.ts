"use server";

import { prisma } from "../database/prisma";

export async function getLogs(
  page: number = 1,
  pageSize: number = 10,
  entityFilter?: string,
  performedByFilter?: string,
) {
  const skip = (page - 1) * pageSize;

  const whereClause: { entity?: string; performedBy?: string } = {};
  if (entityFilter) {
    whereClause.entity = entityFilter;
  }
  if (performedByFilter) {
    whereClause.performedBy = performedByFilter;
  }

  const [logs, totalCount] = await prisma.$transaction([
    prisma.log.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      select: {
        id: true,
        action: true,
        entity: true,
        entityId: true,
        details: true,
        performedBy: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.log.count({ where: whereClause }),
  ]);

  // Fetch entity names dynamically
  const logsWithEntityNames = await Promise.all(logs.map(async (log) => {
    let entityName: string | null = null;
    if (log.entityId) {
      switch (log.entity) {
        case "Rol":
          const role = await prisma.role.findUnique({ where: { id: log.entityId } });
          entityName = role?.name || null;
          break;
        case "Usuario":
          const user = await prisma.user.findUnique({ where: { id: log.entityId } });
          entityName = user?.name || null;
          break;
        case "Permiso":
          const permission = await prisma.permission.findUnique({ where: { id: log.entityId } });
          entityName = permission?.name || null;
          break;
        // Add more cases for other entities as needed
        default:
          entityName = log.entity; // Fallback to entity type if not found or not handled
      }
    }
    return { ...log, entityName };
  }));

  return { logs: logsWithEntityNames, totalCount };
}

// Define LogInput type
type LogInput = {
    action: string;
    entity: string;
    entityId?: string;
    details?: object; // Use 'any' for Json type, or a more specific type if known
    performedBy: string; // User ID
};

// Export logAction function
export async function logAction(data: LogInput) {
    try {
        await prisma.log.create({
            data: {
                action: data.action,
                entity: data.entity,
                entityId: data.entityId,
                details: data.details || {},
                performedBy: data.performedBy,
            },
        });
    } catch (error) {
        console.error("Error al guardar log:", error);
    }
}

export async function getDistinctLogEntities() {
  const entities = await prisma.log.findMany({
    distinct: ['entity'],
    select: { entity: true },
    orderBy: { entity: 'asc' },
  });
  return entities.map(e => e.entity);
}

export async function getDistinctLogPerformers() {
  const performers = await prisma.log.findMany({
    distinct: ['performedBy'],
    select: { performedBy: true, user: { select: { id: true, name: true, email: true } } },
    orderBy: { performedBy: 'asc' },
  });
  return performers.map(p => ({
    id: p.user?.id || p.performedBy,
    name: p.user?.name || p.user?.email || p.performedBy,
  }));
}