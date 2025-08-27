import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      rol: string;
      tenantId: string;
      is2FAEnabled: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image: string;
    rol: string;
    tenantId: string;
    is2FAEnabled: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    image: string;
    rol: string;
    tenantId: string;
    is2FAEnabled: boolean;
  }
}
