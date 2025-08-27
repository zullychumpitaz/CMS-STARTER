// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
	const superAdminRole = await prisma.role.upsert({
		where: { slug: "super-admin" },
		update: {},
		create: {
			name: "Super Administrador",
			slug: "super-admin",
			description: "Rol con todos los permisos",
		},
	});

  // Crear usuario administrador vinculado al rol y tenant
  const hashedPassword = await bcrypt.hash("Thanatos77!", 12);

  await prisma.user.upsert({
    where: { email: "zully@azisperu.com" },
    update: {},
    create: {
      email: "zully@azisperu.com",
      password: hashedPassword,
      phone: "944652179",
      name: "Zully Chumpitaz",
      roleId: superAdminRole.id
    },
  });

  // Permisos
  const permissions = [
    { name: "users:create", description: "Crear usuarios" },
    { name: "users:edit", description: "Editar usuarios" },
    { name: "users:view", description: "Ver usuarios" },
    { name: "users:delete", description: "Eliminar usuarios" },

    { name: "roles:create", description: "Crear roles" },
    { name: "roles:edit", description: "Editar roles" },
    { name: "roles:view", description: "Ver roles" },
    { name: "roles:delete", description: "Eliminar roles" },

    { name: "permissions:create", description: "Crear permisos" },
    { name: "permissions:edit", description: "Editar permisos" },
    { name: "permissions:view", description: "Ver permisos" },
    { name: "permissions:delete", description: "Eliminar permisos" },
  ];

  // Crear permisos
  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  // Asignar todos los permisos al rol super-admin
  const allPermissions = await prisma.permission.findMany();
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: superAdminRole.id,
        permissionId: permission.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });