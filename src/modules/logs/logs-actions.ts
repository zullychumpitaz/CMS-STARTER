import { prisma } from "../database/prisma";


/**
 * Registra una acción en la tabla Log
 *
 * @param action - Descripción corta de la acción (ej: "CREATE", "DELETE", "LOGIN")
 * @param entity - Nombre de la entidad afectada (ej: "User", "Order")
 * @param entityId - ID de la entidad afectada (opcional)
 * @param performedBy - ID del usuario que ejecutó la acción
 * @param details - Objeto con más datos del contexto (opcional)
 */
export async function logAction({
  action,
  entity,
  entityId,
  performedBy,
  details,
}: {
  action: string;
  entity: string;
  entityId?: string;
  performedBy: string;
  details?: Record<string, any>;
}) {
  try {
    await prisma.log.create({
      data: {
        action,
        entity,
        entityId,
        performedBy,
        details: details ? JSON.stringify(details) : undefined,
      },
    });
  } catch (error) {
    console.error("Error guardando log:", error);
  }
}
