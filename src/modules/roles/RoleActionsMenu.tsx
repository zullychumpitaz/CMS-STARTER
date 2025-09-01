'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, SquarePen, TimerReset } from "lucide-react";
import Link from "next/link";
import { DeleteResourceDialog } from "@/components/shared/DeleteResourceDialog";
import { toast } from "sonner";
import { restoreRole } from "./roles-actions";

// Definir el tipo para el objeto role, basado en lo que se usa en el componente
type Role = {
    id: string;
    name: string;
    deletedAt: Date | null;
}

export function RoleActionsMenu({ role }: { role: Role }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleRestore = async () => {
        // Primero, cerramos el menú para que el estado de la UI se asiente.
        setIsOpen(false);
        try {
            await restoreRole(role.id);
            toast.success("Rol restaurado correctamente");
            router.refresh();
        } catch (error) {
            toast.error("Error al restaurar el rol");
        }
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="cursor-pointer"><EllipsisVertical /></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {role.deletedAt === null ? (
                    <>
                        <DropdownMenuItem asChild className="hover:bg-primary/10 hover:text-primary">
                            <Link href={`/roles/${role.id}/edit`} className="text-primary cursor-pointer justify-start flex gap-2 items-center text-sm px-2 py-1.5">
                                <SquarePen size={16} className="text-primary" /> Editar
                            </Link>
                        </DropdownMenuItem>
                        {/* El rol Super Administrador no se puede eliminar */}
                        {role.name !== "Super Administrador" && (
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                               <DeleteResourceDialog resource="rol" resourceId={role.id} onActionComplete={() => setIsOpen(false)} />
                            </DropdownMenuItem>
                        )}
                    </>
                ) : (
                    <DropdownMenuItem onSelect={handleRestore} asChild className="hover:bg-green-600/10 hover:text-green-600">
                        <button className="text-green-600 cursor-pointer justify-start flex gap-2 items-center text-sm w-full px-2 py-1.5">
                            <TimerReset size={16} className="text-green-600" /> Restaurar
                        </button>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
