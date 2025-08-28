import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import ToggleMode from "@/components/shared/ToggleMode";
import { Toaster } from "@/components/ui/sonner";

const plus_jakarta_sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMS STARTER",
  description: "CMS Starter built with Next.js, TailwindCSS and Prisma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
         className={`${plus_jakarta_sans.className} antialiased bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system" // o "light" si no quieres system
          enableSystem // ponlo en true si usas system
          storageKey="app-theme"
          disableTransitionOnChange
        >
          {children}
          <ToggleMode />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
