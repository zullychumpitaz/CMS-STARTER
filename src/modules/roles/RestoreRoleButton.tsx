'use client'

import { restoreRole } from "./roles-actions";
import { toast } from "sonner";
import { TimerReset } from "lucide-react";

export function RestoreRoleButton({ roleId }: { roleId: string }) {

    const handleRestore = async () => {
        try {
            await restoreRole(roleId);
            toast.success("Rol restaurado correctamente");
        } catch (error) {
            toast.error("Error al restaurar el rol");
        }
    }

    return (
        <button onClick={handleRestore} className="text-green-600 cursor-pointer justify-start flex gap-2 items-center p-1 text-sm w-full">
            <TimerReset size={16} className="text-green-600" /> Restaurar
        </button>
    )
}
