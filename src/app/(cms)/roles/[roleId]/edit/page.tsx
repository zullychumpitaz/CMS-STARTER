import { BreadCrumbHeader } from "@/components/shared/BreadCrumbHeader";
import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPermissions } from "@/modules/permissions/permissions-action";
import { RoleForm } from "@/modules/roles/RoleForm";
import { getRoleById } from "@/modules/roles/roles-actions";
import { notFound } from "next/navigation";

const items = [
    { label: "Dashboard", href: "/" },
    { label: "Roles", href: "/roles" },
    { label: "Editar rol" }
];

export default async function RolesPage({ params }: { params: { roleId: string } }) {
    const { roleId } = params; // Destructure roleId explicitly
    const permissions = await getPermissions();
    const role = await getRoleById(roleId); // Use destructured roleId

    if (!role) {
        return notFound();
    }

    return (
        <>
            <section className="flex flex-col gap-4 px-2">
                <BreadCrumbHeader items={ items } />
                <section className="flex justify-between ">
                    <div>
                        <h1 className="text-xl font-bold text-primary">Editar rol</h1>
                        <p className="text-muted-foreground text-sm">Modifica los datos del rol.</p>
                    </div>
                    <Button asChild>
                        <Link href="/roles" className="flex gap-2 items-center text-sm bg-primary font-bold text-muted"><Undo2 size={16} /> Regresar</Link>
                    </Button>
                </section>
                <RoleForm permissions={permissions} role={role} />
            </section>
        </>
    );
}
