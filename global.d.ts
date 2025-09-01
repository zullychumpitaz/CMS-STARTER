import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      rol: string;
      is2FAEnabled: boolean;
      permissions: string; // Store as string in JWT and Session
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image: string;
    rol: string;
    is2FAEnabled: boolean;
    permissions: string; // Store as string in JWT and Session
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    image: string;
    rol: string;
    is2FAEnabled: boolean;
    permissions: string; // Store as string in JWT and Session
  }
}
