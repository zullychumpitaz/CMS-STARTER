import z from "zod";

export const loginSchema = z.object({
  email: z
    .string().nonempty("El email es obligatorio")
    .email("Formato de email inválido"),
  password: z
    .string().nonempty("La contraseña es obligatoria")
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe incluir al menos 1 mayúscula")
    .regex(/[0-9]/, "Debe incluir al menos 1 número")
    .regex(/[^A-Za-z0-9]/, "Debe incluir al menos 1 caracter especial"),
  code: z.string().optional(),
});

export const twoFactorSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Debe ingresar el código de 6 dígitos" })
    .max(6, { message: "Debe ingresar el código de 6 dígitos" }),
});

export type RoleFormValues = z.infer<typeof loginSchema>;
