"use server";

import { ResourceKey, RESOURCES } from "./resources";

export async function deleteResource(resource: ResourceKey, id: string) {
  const config = RESOURCES[resource];
  if (!config) {
    throw new Error(`Recurso no soportado: ${resource}`);
  }
  return await config.delete(id);
}