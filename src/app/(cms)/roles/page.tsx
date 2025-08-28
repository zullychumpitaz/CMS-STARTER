import { BreadCrumbHeader } from "@/components/shared/BreadCrumbHeader";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getRoles } from "@/modules/roles/roles-actions";
import { Badge } from "@/components/ui/badge"
import { getPermissionColor, MAX_PERMISSIONS } from "@/types/roles";
import { EllipsisVertical, Lock, Plus, SquarePen, Trash2, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DeleteResourceDialog } from "@/components/shared/DeleteResourceDialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const items = [
    { label: "Dashboard", href: "/" },
    { label: "Roles", href: "/roles" },
    { label: "Listado de roles" }
];

export default async function RolesPage() {
    const roles = await getRoles();

    return (
        <>
            <section className="flex flex-col gap-4 px-2">
                <BreadCrumbHeader items={ items } />
                <section className="flex justify-between ">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Roles</h1>
                        <p className="text-muted-foreground text-sm">Administra los roles y permisos de los usuarios en el sistema.</p>
                    </div>
                    <Button asChild>
                        <Link href="/roles/create" className="flex gap-2 items-center text-sm bg-primary font-bold text-muted"><Plus size={16} /> Crear rol</Link>
                    </Button>
                </section>
                <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {
                        roles.map( (role) => {
                            return (
                                <Card key={ role.id } className="bg-card mt-2">
                                    <CardHeader>
                                        <CardTitle className="font-bold flex items-center gap-2"> <Badge className={`h-4 min-w-4 rounded-full px-1 font-mono tabular-nums ${role.deletedAt === null ? "bg-green-700" : "bg-red-700" }`} /> { role.name }</CardTitle>
                                        <CardDescription>{ role.description }</CardDescription>
                                        <CardAction>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="cursor-pointer"><EllipsisVertical /></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Dialog>
                                                            <DialogTrigger className="text-primary cursor-pointer justify-start flex gap-2 items-center p-1 text-sm">
                                                                <SquarePen size={16} className="text-primary" /> Editar
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                <DialogTitle>Editar rol</DialogTitle>
                                                                <DialogDescription>
                                                                    {/* Formulario de edición */}
                                                                </DialogDescription>
                                                                </DialogHeader>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <DeleteResourceDialog resource="rol" resourceId={role.id} />
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </CardAction>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <p className="font-semibold text-foreground text-sm mb-1">Permisos:</p>
                                        <div className="flex gap-2 w-full flex-wrap">
                                            {
                                                role.permissions.slice(0, MAX_PERMISSIONS).map((perm) => {
                                                const action = perm.permission.name.split(":")[1];
                                                const color = getPermissionColor(action);

                                                return (
                                                    <Badge
                                                    key={perm.permission.id}
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-secondary/80 font-bold ${color}`}
                                                    >
                                                    {perm.permission.name}
                                                    </Badge>
                                                );
                                                })
                                            }

                                            {role.permissions.length > MAX_PERMISSIONS && (
                                            <Badge
                                                className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-200 text-gray-800"
                                            >
                                                +{role.permissions.length - MAX_PERMISSIONS} más
                                            </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t flex justify-between text-sm">
                                            {
                                                role._count.users === 1 ?
                                                    <div className="text-sm flex gap-2 items-center">
                                                        <Users width={16} /> <span>{ role._count.users } usuario asignado</span>
                                                    </div>
                                                    :
                                                    <div className="text-sm flex gap-2 items-center">
                                                        <Users width={16} /> <span>{ role._count.users } usuarios asignados</span>
                                                    </div>

                                            }
                                        <div>
                                            {
                                                role.name === "Super Administrador" &&
                                                <Badge className="bg-gray-100 text-gray-800 font-bold px-2.5 py-0.5 rounded-full"><Lock /> Sistema</Badge>
                                            }
                                        </div>
                                    </CardFooter>
                                </Card>
                            )
                        })
                    }
                </section>
            </section>
        </>
    );
}