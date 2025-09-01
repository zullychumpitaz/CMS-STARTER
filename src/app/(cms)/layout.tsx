import { AppSidebar } from "@/components/shared/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SessionProvider } from "next-auth/react"
import { cookies } from "next/headers"
import { auth } from "@/modules/auth/auth"
import { getRoleByName } from "@/modules/roles/roles-actions"
import { getPermissionsAsOptions } from "@/modules/permissions/permissions-action"
 
export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  const session = await auth();
  let userPermissions: string[] = [];
  let allPermissions: { id: string; name: string; }[] = [];

  if (session?.user?.rol) {
    const role = await getRoleByName(session.user.rol);
    if (role && role.permissions) {
      userPermissions = role.permissions.map(p => p.permissionId);
    }
  }

  return (
    <SessionProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <main className="w-full px-6">
            <section className="py-2">
              <SidebarTrigger />
            </section>
            {children}
          </main>
        </SidebarProvider>
    </SessionProvider>
  )
}