import { BreadCrumbHeader } from "@/components/shared/BreadCrumbHeader";
import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPermissionById } from "@/modules/permissions/permissions-action";
import { EditPermissionForm } from "@/modules/permissions/EditPermissionForm";
import { notFound } from "next/navigation";

const items = [
    { label: "Dashboard", href: "/" },
    { label: "Permisos", href: "/permissions" },
    { label: "Editar permiso" }
];

export default async function PermissionsPage({ params }: { params: { permissionId: string } }) {
    const typedParams = params as { permissionId: string }; // Type assertion
    const permission = await getPermissionById(typedParams.permissionId);

    if (!permission) {
        return notFound();
    }

    return (
        <>
            <section className="flex flex-col gap-4 px-2">
                <BreadCrumbHeader items={ items } />
                <section className="flex justify-between ">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Editar permiso</h1>
                        <p className="text-muted-foreground text-sm">Modifica los datos del permiso.</p>
                    </div>
                    <Button asChild>
                        <Link href="/permissions" className="flex gap-2 items-center text-sm bg-primary font-bold text-muted"><Undo2 size={16} /> Regresar</Link>
                    </Button>
                </section>
                <EditPermissionForm permission={permission} />
            </section>
        </>
    );
}