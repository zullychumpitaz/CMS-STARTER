import { AppSidebar } from "@/components/shared/AppSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SessionProvider } from "next-auth/react"
import { cookies } from "next/headers"
 
export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

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