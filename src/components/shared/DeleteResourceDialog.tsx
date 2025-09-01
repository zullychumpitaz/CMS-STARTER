// components/DeleteResourceDialog.tsx
"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { deleteResource } from "@/modules/shared/delete-actions";
import { ResourceKey, RESOURCES } from "@/modules/shared/resources";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Trash2 } from "lucide-react";

type Props = {
  resource: ResourceKey;
  resourceId: string;
  onActionComplete?: () => void;
};

export function DeleteResourceDialog({ resource, resourceId, onActionComplete }: Props) {
  const resourceLabel = RESOURCES[resource].label;
  const router = useRouter();

  async function handleConfirm() {
    // Primero, cerramos el menú/diálogo para que el estado de la UI se asiente.
    onActionComplete?.();

    try {
        await deleteResource(resource, resourceId);
        toast.success(`${resourceLabel} eliminado correctamente`);
        router.refresh(); // Refrescar los datos de la página actual
    } catch (error) {
      console.log(error)
        toast.error(`Error al eliminar el ${resourceLabel}`);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-destructive cursor-pointer flex gap-2 items-center text-sm w-full px-2 py-1.5 hover:bg-destructive/10 hover:text-destructive">
          <Trash2 size={16} /> Eliminar
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Seguro que deseas eliminar este {resourceLabel}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El {resourceLabel} será eliminado permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive hover:bg-red-800 cursor-pointer"
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}