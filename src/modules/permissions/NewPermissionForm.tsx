"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PermissionFormValues, permissionSchema } from "./permissions-validations";
import { createPermission } from "./permissions-action";

type FormValues = PermissionFormValues;


export function NewPermissionForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(permissionSchema),
  });

  const router = useRouter();
  
  const onSubmit = async (data: FormValues) => {
    try {
      await createPermission(data);
      toast.success("Permiso creado correctamente");
      router.push("/permissions");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al crear el permiso");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="dark:bg-dark card no-inset no-ring undefined dark:shadow-dark-md relative mt-6 w-full flex-col border border-border bg-card p-0 pb-6 break-words shadow-md dark:border-gray-700 mx-auto rounded-xl"
    >
        <div className="mx-auto w-[400px] flex flex-col justify-center">
            <div className="flex h-full flex-col justify-start gap-0 py-4">
                <div className="px-6 py-2">
                <label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground"
                >
                    Nombre del permiso
                </label>
                <br />
                <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-500 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
                </div>
                <div className="px-6 py-2">
                <label
                    htmlFor="description"
                    className="text-sm font-semibold text-gray-900 dark:text-white"
                >
                    Descripción del permiso
                </label>
                <br />
                <input
                    type="text"
                    id="description"
                    {...register("description")}
                    className="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-500 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                {errors.description && <p style={{ color: "red" }}>{errors.description.message}</p>}
                </div>
                <div className="px-6 py-2">
                <label
                    htmlFor="category"
                    className="text-sm font-semibold text-gray-900 dark:text-white"
                >
                    Categoría del permiso
                </label>
                <br />
                <input
                    type="text"
                    id="category"
                    {...register("category")}
                    className="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-500 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
                {errors.category && <p style={{ color: "red" }}>{errors.category.message}</p>}
                </div>
            </div>
            <div className="flex w-full col-span-2 items-center justify-between px-6">
                <button
                type="submit"
                className="group bg-primary hover:!bg-primaryemphasis relative flex h-10 w-fit cursor-pointer items-center justify-center rounded-md p-0.5 px-4 py-2 text-center text-sm font-medium text-white focus:shadow-none focus:ring-0 focus:outline-none"
                >
                Crear permiso
                </button>
            </div>
        </div>
    </form>
  );
}
