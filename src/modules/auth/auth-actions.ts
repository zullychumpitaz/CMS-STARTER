"use server";
import { prisma } from "../database/prisma";
import { sendVerificationEmail } from "../emails/2fa-template";
import { logAction } from "../logs/logs-actions"; // Import logAction
import { accionesLog } from "../logs/logs-types"; // Import accionesLog

import { Prisma } from "@prisma/client"; // Import Prisma types

// Define a type for the user object returned by getUserByEmail
export type UserWithRole = Prisma.UserGetPayload<{
  include: {
    role: {
      select: {
        name: true;
        permissions: {
          select: {
            permission: {
              select: {
                id: true;
                name: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export async function getUserByEmail(email: string): Promise<UserWithRole | null> {
  return await prisma.user.findUnique({
    where: {
      email: email,
      deletedAt: null,
    },
    include: {
      role: {
        select: {
          name: true,
          permissions: {
            select: {
              permission: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export const sendTwoFactorCode = async (email: string) => {
  if (!email) {
    return {
      success: false,
      error: "Email is required",
      code: "MISSING_EMAIL",
    };
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        error: "User not found",
        code: "USER_NOT_FOUND",
      };
    }

    if (!user.is2FAEnabled) {
        return {
            success: true,
            code: "2FA_NOT_REQUIRED"
        }
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    await saveVerificationCode(user.id, verificationCode, expiresAt);
    await sendVerificationEmail(user.email, verificationCode);

    await logAction({
        action: accionesLog.CREATE, // Or a more specific action like '2FA_CODE_SENT'
        entity: "Código 2FA",
        entityId: user.id,
        performedBy: user.id,
        details: { reason: "Código 2FA enviado para inicio de sesión" },
    });

    return {
      success: true,
      code: "2FA_CODE_SENT",
    };
  } catch (error) {
    await logAction({
        action: accionesLog.LOGIN,
        entity: "Código 2FA",
        performedBy: "Sistema", // Or a generic system user ID if available
        details: { reason: `Error al enviar código 2FA: ${error instanceof Error ? error.message : String(error)}` },
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
      code: "SERVER_ERROR",
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