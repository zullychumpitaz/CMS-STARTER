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

import { Trash2 } from "lucide-react";

type Props = {
  resource: ResourceKey;
  resourceId: string;
};

export function DeleteResourceDialog({ resource, resourceId }: Props) {
  const resourceLabel = RESOURCES[resource].label;

  async function handleConfirm() {
    await deleteResource(resource, resourceId);
    window.location.reload(); // refrescar vista
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-destructive cursor-pointer flex gap-2 items-center p-1 text-sm">
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
