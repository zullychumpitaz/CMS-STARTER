import { BreadCrumbHeader } from "@/components/shared/BreadCrumbHeader";
import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPermissionsAsOptions } from "@/modules/permissions/permissions-action";
import { NewRoleForm } from "@/modules/roles/NewRoleForm";
const items = [
    { label: "Dashboard", href: "/" },
    { label: "Roles", href: "/roles" },
    { label: "Crear rol" }
];

export default async function RolesPage() {
    const permissions = await getPermissionsAsOptions();

    return (
        <>
            <section className="flex flex-col gap-4 px-2">
                <BreadCrumbHeader items={ items } />
                <section className="flex justify-between ">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Crear rol</h1>
                        <p className="text-muted-foreground text-sm">Completa los datos para crear un nuevo rol.</p>
                    </div>
                    <Button asChild>
                        <Link href="/roles" className="flex gap-2 items-center text-sm bg-primary font-bold text-muted"><Undo2 size={16} /> Regresar</Link>
                    </Button>
                </section>
                <NewRoleForm permissions={permissions} />
            </section>
        </>
    );
}