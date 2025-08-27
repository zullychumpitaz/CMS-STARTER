'use server';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, code: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "CMS STARTER <noreply@soda.promo>",
      to: [email],
      subject: "Código de verificación",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Código de Verificación</h2>
          <p style="color: #666; font-size: 16px;">
            Hemos recibido una solicitud para iniciar sesión en tu cuenta.
          </p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h3 style="color: #333; margin: 0;">Tu código de verificación es:</h3>
            <div style="font-size: 32px; font-weight: bold; color: #4f46e5; letter-spacing: 4px; margin: 10px 0;">
              ${code}
            </div>
          </div>
          <p style="color: #666; font-size: 14px;">
            Este código expirará en 10 minutos. Si no solicitaste este código, puedes ignorar este email.
          </p>
          <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">
            Este es un email automático, por favor no respondas a este mensaje.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}
