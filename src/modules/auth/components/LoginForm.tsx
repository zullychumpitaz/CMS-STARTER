"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { LoginStepOne, TwoFactorLogin } from "../auth-actions";
import { loginSchema, twoFactorSchema } from "../validations/auth";
import Logo from "@/components/shared/Logo";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });
  const form2 = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const router = useRouter();
  const [step, setStep] = useState(1);

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    setEmail(values.email);

    try {
      // Primer paso: email y password
      const result = await LoginStepOne(values.email, values.password);
      setEmail(values.email);
      setPassword(values.password);

      if (result.code === "2FA_CODE_SENT") {
        setStep(2);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Login error");
    } finally {
      setIsLoading(false);
    }
  };

  const twoStepValidation = async (values: z.infer<typeof twoFactorSchema>) => {
    setIsLoading(true);

    try {
      // Segundo paso: verificar código 2FA
      const result = await TwoFactorLogin(email, password, values.code);

      if (result.code === "LOGIN_SUCCESS") {
        router.push("/dashboard");
      } else {
        console.log(result.error || "Código inválido");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.log("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-card border-border m-auto h-fit w-full max-w-sm rounded-md border p-0.5 shadow-md"
          >
            <div className="flex flex-col gap-4 p-8 pb-6">
              <div className="flex flex-col items-center">
                <Logo />
                <p className="pt-2 text-sm">Bienvenid@! Inicia sesión</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@gmail.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="********"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                data-loading={isLoading || undefined}
                className="group bg-primary relative cursor-pointer text-white disabled:opacity-100"
              >
                <span className="text-primary-foreground!">
                  Iniciar sesión
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoaderCircleIcon
                      className="animate-spin"
                      size={16}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </>
    );
  }

  return (
    <Form {...form2}>
      <form
        onSubmit={form2.handleSubmit(twoStepValidation)}
        className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border border-[--color-muted:var(--color-background)] p-0.5 shadow-md"
      >
        <div className="flex flex-col gap-4 p-8 pb-6">
          <div className="flex flex-col items-center">
            <Logo />
          </div>
          <div className="text-body mb-4 text-center text-sm">
            <p>Se ha enviado un código de verificación a:</p>
            <p className="font-semibold">{email}</p>
          </div>

          <FormField
            control={form2.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center gap-4">
                <FormLabel>Código de verificación</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            data-loading={isLoading || undefined}
            className="group bg-primary hover:dark:bg-blue-80 relative cursor-pointer text-white disabled:opacity-100"
          >
            <span className="text-primary-foreground!">
              Validar código
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoaderCircleIcon
                  className="animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
