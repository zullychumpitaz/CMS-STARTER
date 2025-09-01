import { BreadCrumbHeader } from "@/components/shared/BreadCrumbHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPermissions } from "@/modules/permissions/permissions-action";
import { Plus } from "lucide-react";
import PermissionsTable from "@/modules/permissions/PermissionsTable";
const items = [
    { label: "Dashboard", href: "/" },
    { label: "Permisos", href: "/permissions" },
    { label: "Listado de permisos" }
];

export default async function PermissionsPage() {
    const permissions = await getPermissions();

    return (
        <>
            <section className="flex flex-col gap-4 px-2">
                <BreadCrumbHeader items={ items } />
                <section className="flex justify-between ">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Permisos</h1>
                        <p className="text-muted-foreground text-sm">Administra los permisos de los usuarios en el sistema.</p>
                    </div>
                    <Button asChild>
                        <Link href="/permissions/create" className="flex gap-2 items-center text-sm bg-primary font-bold text-muted"><Plus size={16} /> Crear permiso</Link>
                    </Button>
                </section>
                <section className="">
                    <PermissionsTable permissionsDB={ permissions } />
                </section>
            </section>
        </>
    );
}