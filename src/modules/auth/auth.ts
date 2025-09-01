import NextAuth, { NextAuthConfig, User } from "next-auth"
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail, getVerificationCode, deleteVerificationCode, UserWithRole } from "./auth-actions";
import { logAction } from "../logs/logs-actions"; // Import logAction
import { accionesLog } from "../logs/logs-types"; // Import accionesLog
 
export const authOptions: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email);
        const password = String(credentials?.password);
        const code = String(credentials?.code);

        if (!email || !password) {
          return null;
        }

        try {
          const user: UserWithRole | null = await getUserByEmail(email);
          if (!user) {
            await logAction({
                action: accionesLog.LOGIN_FAIL,
                entity: "Usuario",
                performedBy: "Desconocido", // User not found
                details: { reason: `Intento de login fallido: Usuario no encontrado (${email})` },
            });
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            password,
            user.password!,
          );

          if (!isValidPassword) {
            await logAction({
                action: accionesLog.LOGIN_FAIL,
                entity: "Usuario",
                entityId: user.id,
                performedBy: user.id,
                details: { reason: `Intento de login fallido: Contraseña inválida para ${email}` },
            });
            return null;
          }

          // Si el 2FA está activado, verificar el código
          if (user.is2FAEnabled) {
            if (!code) {
                await logAction({
                    action: accionesLog.LOGIN_FAIL,
                    entity: "Usuario",
                    entityId: user.id,
                    performedBy: user.id,
                    details: { reason: `Intento de login fallido: Código 2FA requerido para ${email}` },
                });
                throw new Error("2FA_REQUIRED"); // Throw error to be caught by frontend
            }

            const dbCode = await getVerificationCode(user.id);
            if (!dbCode || dbCode.code !== code) {
                await logAction({
                    action: accionesLog.LOGIN_FAIL,
                    entity: "Usuario",
                    entityId: user.id,
                    performedBy: user.id,
                    details: { reason: `Intento de login fallido: Código 2FA inválido para ${email}` },
                });
                return null; // Código inválido
            }

            if (new Date() > dbCode.expiresAt) {
                await logAction({
                    action: accionesLog.LOGIN_FAIL,
                    entity: "Usuario",
                    entityId: user.id,
                    performedBy: user.id,
                    details: { reason: `Intento de login fallido: Código 2FA expirado para ${email}` },
                });
                return null; // Código expirado
            }

            // El código es válido, eliminarlo y continuar
            await deleteVerificationCode(user.id);
          }

          // Login exitoso
          await logAction({
              action: accionesLog.LOGIN,
              entity: "Usuario",
              entityId: user.id,
              performedBy: user.id,
              details: { reason: `Login exitoso para ${email}` },
          });

          // Si 2FA no está activado o si el código fue validado con éxito
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            rol: user.role.name,
            image: user.image,
            is2FAEnabled: user.is2FAEnabled,
            permissions: JSON.stringify(user.role.permissions.map(p => ({ id: p.permission.id, name: p.permission.name }))),
          } as User;
        } catch (error) {
          console.error("Error in authorize:", error);
          if (error instanceof Error && error.message === "2FA_REQUIRED") {
            throw error;
          }
          await logAction({
              action: accionesLog.LOGIN,
              entity: "Autenticación",
              performedBy: "Sistema",
              details: { reason: `Error inesperado en autorización: ${error instanceof Error ? error.message : String(error)}` },
          });
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.email = user.email!;
        token.name = user.name!;
        token.image = user.image;
        token.rol = user.rol;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email!;
        session.user.name = token.name!;
        session.user.rol = token.rol as string;
        session.user.image = token.image as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);