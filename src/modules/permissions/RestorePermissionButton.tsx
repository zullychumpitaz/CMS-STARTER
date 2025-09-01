'use client'

import { restorePermission } from "./permissions-action";
import { toast } from "sonner";
import { TimerReset } from "lucide-react";

export function RestorePermissionButton({ permissionId }: { permissionId: string }) {

    const handleRestore = async () => {
        try {
            await restorePermission(permissionId);
            toast.success("Permiso restaurado correctamente");
        } catch (error) {
            toast.error("Error al restaurar el permiso");
        }
    }

    return (
        <button onClick={handleRestore} className="text-green-600 cursor-pointer justify-start flex gap-2 items-center p-1 text-sm w-full">
            <TimerReset size={16} className="text-green-600" /> Restaurar
        </button>
    )
}