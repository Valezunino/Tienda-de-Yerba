# Entre Yerbas

Tienda online de yerba mate con catálogo, carrito de pedidos por WhatsApp y panel administrativo.

## Configuración

1. Crear un proyecto en Supabase y ejecutar `supabase/schema.sql`.
2. Crear el usuario administrador en Authentication y agregar su ID a `public.admin_users`.
3. Copiar `.env.example` como `.env.local` y completar la URL y clave publicable de Supabase.
4. Ejecutar `npm run dev` para desarrollo o `npm run build` para validar producción.

La contraseña del administrador nunca debe guardarse en el repositorio.

## Producción

El proyecto está preparado para desplegarse en Vercel desde la rama `main`.
