export const MAX_PERMISSIONS= 7;

// Constante de colores por tipo de permiso
export const PERMISSION_COLORS: Record<string, string> = {
  view: "bg-[#FEEDD4] text-[#983412]",      // listar
  create: "bg-[#D0FBE4] text-[#065E47]",   // crear
  edit: "bg-[#DAE9FF] text-[#1C41AF]",    // editar
  delete: "bg-[#FAE7F3] text-[#9D164C]",     // eliminar
  special: "bg-[#F3E6FE] text-[#6B21A8]", // permisos especiales
};

// Función para obtener el color
export function getPermissionColor(action: string): string {
  return PERMISSION_COLORS[action] || "bg-gray-400 text-black";
}