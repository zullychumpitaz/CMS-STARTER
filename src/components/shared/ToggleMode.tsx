"use client";

import { useId, useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

export default function ToggleMode() {
  const id = useId();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Evita desincronización entre SSR y CSR
  if (!mounted) {
    return (
      <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium opacity-0">
        <Switch id={id} />
        <span />
        <span />
      </div>
    );
  }

  const isLight = resolvedTheme === "light";
  console.log("Current theme:", resolvedTheme);

  return (
    <div>
      <div className="absolute top-2 right-2 inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium">
        <Switch
          id={id}
          checked={isLight}
          onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
          className="peer data-[state=checked]:bg-neutral-400 data-[state=unchecked]:bg-black/50 absolute inset-0 h-[inherit] w-auto cursor-pointer [&_span]:h-full [&_span]:w-1/2 [&_span]:transition-transform [&_span]:duration-300 [&_span]:ease-[cubic-bezier(0.16,1,0.3,1)] [&_span]:data-[state=checked]:translate-x-full [&_span]:data-[state=checked]:rtl:-translate-x-full"
        />
        <span className="peer-data-[state=unchecked]:text-black pointer-events-none relative ms-0.5 flex min-w-8 items-center justify-center text-center">
          <MoonIcon size={16} aria-hidden="true" />
        </span>
        <span className="peer-data-[state=checked]:text-black pointer-events-none relative me-0.5 flex min-w-8 items-center justify-center text-center">
          <SunIcon size={16} aria-hidden="true" />
        </span>
      </div>
      <Label htmlFor={id} className="sr-only">
        Theme toggle
      </Label>
    </div>
  );
}
