"use server";
import bcrypt from "bcryptjs";
import { prisma } from "../database/prisma";
import { sendVerificationEmail } from "../emails/2fa-template";
import { logAction } from "../logs/logs-actions";
import { accionesLog } from "../logs/logs-types";
import { signIn } from "./auth";

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
      deletedAt: null,
    },
    include: {
      role: {
        select: { name: true }, // Trae solo el nombre del rol
      },
    },
  });
}

export const LoginStepOne = async (email: string, password: string) => {
  if (!email || !password) {
    console.log("Email and password are required");
    return {
      success: false,
      error: "Email and password are required",
      code: "MISSING_CREDENTIALS",
    };
  }

  try {
    const user = await getUserByEmail(email);
    console.log("User found:", user);

    if (!user) {
      return {
        success: false,
        error: "User not found",
        code: "USER_NOT_FOUND",
      };
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password!);
    console.log("Password match:", passwordMatch);
    if (!passwordMatch) {
      return {
        success: false,
        error: "Invalid password",
        code: "INVALID_PASSWORD",
      };
    }

    // Generar código 2FA
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // Guardar código en base de datos
    await saveVerificationCode(user.id, verificationCode, expiresAt);

    // Enviar email con código
    await sendVerificationEmail(user.email, verificationCode);

    return {
      success: true, // false porque necesita el código 2FA
      error: "Código de verificación enviado",
      code: "2FA_CODE_SENT",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        is2FAEnabled: user.is2FAEnabled,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
      code: "SERVER_ERROR",
      user: null,
    };
  }
};

export const TwoFactorLogin = async (
  email: string,
  password: string,
  code: string,
) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      success: false,
      error: "User not found",
      code: "USER_NOT_FOUND",
    };
  }

  try {
    // Si hay código, verificar 2FA
    const dbCode = await getVerificationCode(user.id);

    if (!dbCode) {
      await logAction({
        action: accionesLog.LOGIN,
        entity: "Usuario",
        entityId: user.id,
        performedBy: user.id,
        details: { reason: "2FA code not found" },
      });

      return {
        success: false,
        error: "2FA code not found",
        code: "2FA_CODE_NOT_FOUND",
      };
    }

    const isValidCode = dbCode.code === code && new Date() < dbCode.expiresAt;
    if (!isValidCode) {
      await logAction({
        action: accionesLog.LOGIN,
        entity: "Usuario",
        entityId: user.id,
        performedBy: user.id,
        details: { reason: "Invalid or expired code" },
      });

      return {
        success: false,
        error: "Invalid or expired code",
        code: "INVALID_CODE",
      };
    }

    await deleteVerificationCode(user.id); // Eliminar código después de usarlo

    await logAction({
      action: accionesLog.LOGIN,
      entity: "Usuario",
      entityId: user.id,
      performedBy: user.id,
      details: { reason: "Login con 2FA" },
    });

    // Código válido, permitir login
    const authResult = await signIn("credentials", {
      email,
      password: password,
      redirect: false,
    });

    if (authResult) {
      return {
        success: true,
        error: "",
        code: "LOGIN_SUCCESS",
      };
    } else {
      return {
        success: false,
        error: "Problem with Login",
        code: "PROBLEM_LOGIN",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Problem with 2FA code",
      code: "PROBLEM_CODE",
    };
  }
};

export async function saveVerificationCode(
  userId: string,
  code: string,
  expiresAt: Date,
) {
  return await prisma.user.update({
    where: { id: userId, deletedAt: null },
    data: {
      verificationCode: code,
      codeExpiry: expiresAt,
    },
  });
}

export async function getVerificationCode(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
    select: {
      verificationCode: true,
      codeExpiry: true,
    },
  });

  if (!user?.verificationCode || !user?.codeExpiry) {
    return null;
  }

  return {
    code: user.verificationCode,
    expiresAt: user.codeExpiry,
  };
}

export async function deleteVerificationCode(userId: string) {
  return await prisma.user.update({
    where: { id: userId, deletedAt: null },
    data: {
      verificationCode: null,
      codeExpiry: null,
    },
  });
}

export async function verifyCode(userId: string, twoFactorCode: string) {
  return await prisma.user.findUnique({
    where: { id: userId, verificationCode: twoFactorCode, deletedAt: null },
  });
}