'use client'

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, SquarePen } from "lucide-react";
import Link from "next/link";
import { DeleteResourceDialog } from "@/components/shared/DeleteResourceDialog";
import { RestorePermissionButton } from "./RestorePermissionButton"; // Import the new component
import { PermissionWithRoles } from "./permissions-utils"; // Import the full type

export function PermissionActionsMenu({ permission }: { permission: PermissionWithRoles }) { // Use the full type
    const [isOpen, setIsOpen] = useState(false);

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger className="cursor-pointer"><EllipsisVertical /></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {permission.deletedAt ? (
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                        <RestorePermissionButton permissionId={permission.id} />
                    </DropdownMenuItem>
                ) : (
                    <>
                        <DropdownMenuItem asChild className="hover:bg-primary/10 hover:text-primary">
                            <Link href={`/permissions/${permission.id}/edit`} className="text-primary cursor-pointer justify-start flex gap-2 items-center text-sm px-2 py-1.5">
                                <SquarePen size={16} className="text-primary" /> Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
                            <DeleteResourceDialog resource="permission" resourceId={permission.id} onActionComplete={() => setIsOpen(false)} />
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
