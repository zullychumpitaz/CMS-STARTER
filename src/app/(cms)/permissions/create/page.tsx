import { BreadCrumbHeader } from "@/components/shared/BreadCrumbHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Undo2 } from "lucide-react";
import { NewPermissionForm } from "@/modules/permissions/NewPermissionForm";

const items = [
    { label: "Dashboard", href: "/" },
    { label: "Permisos", href: "/permissions" },
    { label: "Crear permiso" }
];

export default async function PermissionsCreatePage() {

    return (
        <>
            <section className="flex flex-col gap-4 px-2">
                <BreadCrumbHeader items={ items } />
                <section className="flex justify-between ">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Crear Permiso</h1>
                        <p className="text-muted-foreground text-sm">Completa los datos para crear un nuevo permiso.</p>
                    </div>
                    <Button asChild>
                        <Link href="/permissions" className="flex gap-2 items-center text-sm bg-primary font-bold text-muted"><Undo2 size={16} /> Regresar</Link>
                    </Button>
                </section>
                <section className="">
                    <NewPermissionForm />
                </section>
            </section>
        </>
    );
}