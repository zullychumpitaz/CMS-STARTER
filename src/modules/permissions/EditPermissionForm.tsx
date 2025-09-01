'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { updatePermission } from './permissions-action';
import { Permission } from '@prisma/client';
import { permissionSchema } from './permissions-validations';

export function EditPermissionForm({ permission }: { permission: Permission }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof permissionSchema>>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: permission.name,
      description: permission.description || '',
      category: permission.category as "create" | "edit" | "delete" | "view" | "special" || '',
    },
  });

  async function onSubmit(values: z.infer<typeof permissionSchema>) {
    try {
      await updatePermission(permission.id, values);
      toast.success('Permiso actualizado correctamente');
      router.push('/permissions');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Editar Permiso</CardTitle>
        <CardDescription>Modifica los detalles del permiso.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Permiso</FormLabel>
                  <FormControl>
                    <Input placeholder="ej: user:create" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input placeholder="ej: Crear nuevos usuarios" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="create">Crear</SelectItem>
                      <SelectItem value="edit">Editar</SelectItem>
                      <SelectItem value="delete">Eliminar</SelectItem>
                      <SelectItem value="view">Ver</SelectItem>
                      <SelectItem value="special">Especial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Guardar Cambios
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
