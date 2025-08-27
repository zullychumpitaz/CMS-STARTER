"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DarkLogo from "/public/images/logos/dark-logo.svg";
import LightLogo from "/public/images/logos/light-logo.svg";
import Link from "next/link";
import { useTheme } from "next-themes";

const Logo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Mientras hidrata, no mostrar nada para evitar flicker
    return <div className="h-8 w-32" />;
  }

  return (
    <Link href={"/"}>
      {resolvedTheme === "light" ? (
        <Image
          src={DarkLogo}
          alt="logo light"
          className="rtl:scale-x-[-1]"
          priority
        />
      ) : (
        <Image
          src={LightLogo}
          alt="logo dark"
          className="rtl:scale-x-[-1]"
          priority
        />
      )}
    </Link>
  );
};

export default Logo;
