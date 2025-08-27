# CMS STARTER

## Levantar el proyecto en desarrollo

Paso 1: Ejecutar la instalación de las dependencias:

```bash
pnpm install
```

Paso 2: Clonar el archivo .env.template y renombrarlo a .env

Paso 3: Coonfigurar las variables de entorno en el archivo .env

Paso 4: Levantar el contenedor con la base de datos:

```bash
docker compose up -d
```

Paso 5: Ejecutar la migración de Prisma ORM y ejecutar el seed

```bash
pnpx prisma migrate dev
pnpm run seed
```

Paso 6: Levantar el proyecto

```bash
pnpm run dev
```
