## Importante

- Usa siempre pnpm como gestor de dependencias.
- Mantén una estructura modular para todo el proyecto.
- Define los server actions teniendo uno por cada recurso, ej: roles-actions.ts, users-actions.ts, etc.
- Define las llamadas a los server actions que se hacen desde los client components como llamadas a funciones, no uses llamadas a los server actions inline.
- Si hay que instalar dependencias, usa siempre el tag -E para instalar la versión exacta.
- Verifica que todos los archivos que contienen server actions empiecen con 'use server';
