"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRole } from "./roles-actions";
import { RoleFormValues, roleSchema } from "./roles-validation";
import SelectPermissions from "../permissions/SelectPermissions";
import { mapPermissionsToOptions } from "../permissions/permissions-utils";

type FormValues = RoleFormValues;


export function NewRoleForm({
  permissions,
}: {
  permissions: { id: string; name: string }[];
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(roleSchema),
  });

  const router = useRouter();
  const permissionOptions = mapPermissionsToOptions(permissions)
  
  const onSubmit = async (data: FormValues) => {
    console.log(data);
    try {
      await createRole(data);
      toast.success("Rol creado correctamente");
      router.push("/roles");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al crear el rol");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="dark:bg-dark card no-inset no-ring undefined dark:shadow-dark-md relative mt-6 w-full flex-col border border-border bg-card p-0 pb-6 break-words shadow-md dark:border-gray-700 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-xl"
    >
      <div className="flex h-full flex-col justify-start gap-0 py-4">
        <div className="px-6 py-2">
          <label
            htmlFor="name"
            className="text-sm font-semibold text-foreground"
          >
            Nombre del rol
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
            Descripción del rol
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
            htmlFor="slug"
            className="text-sm font-semibold text-gray-900 dark:text-white"
          >
            Slug del rol
          </label>
          <br />
          <input
            type="text"
            id="slug"
            {...register("slug")}
            className="focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-500 focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          {errors.slug && <p style={{ color: "red" }}>{errors.slug.message}</p>}
        </div>
      </div>
      <div className="flex h-full flex-col justify-start gap-0 py-4">
        <div style={{ marginTop: "1rem" }}>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Permisos:
            </p>
            <Controller
                name="permissions"
                control={control}
                render={({ field }) => (
                    <SelectPermissions
                    options={permissionOptions} // TODAS las opciones disponibles
                    value={field.value || []} // valor actual del form
                    onChange={field.onChange} // conecta con RHF
                    />
                )}
                />
            
            {errors.permissions && <p style={{ color: "red" }}>{errors.permissions.message}</p>}
          </div>
      </div>
      <div className="flex w-full col-span-2 items-center justify-between px-6">
        <button
          type="submit"
          className="group bg-primary hover:!bg-primaryemphasis relative flex h-10 w-fit cursor-pointer items-center justify-center rounded-md p-0.5 px-4 py-2 text-center text-sm font-medium text-white focus:shadow-none focus:ring-0 focus:outline-none"
        >
          Guardar rol
        </button>

        <Link
          href={"/roles"}
          className="group bg-error hover:!bg-primaryemphasis relative flex h-10 w-fit cursor-pointer items-center justify-center rounded-md p-0.5 px-4 py-2 text-center text-sm font-medium text-white focus:shadow-none focus:ring-0 focus:outline-none"
        >
          Regresar
        </Link>
      </div>
    </form>
  );
}
