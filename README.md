# Invitaciones app — front base

Vista pública de invitación (Next.js + TypeScript + Tailwind), con datos de
ejemplo mientras no está conectada la base de datos.

## Requisitos

- Node.js 18 o superior instalado (https://nodejs.org)

## Cómo correrlo

1. Descomprime este proyecto en una carpeta.
2. Abre una terminal dentro de esa carpeta.
3. Instala las dependencias:

   ```
   npm install
   ```

4. Levanta el servidor de desarrollo:

   ```
   npm run dev
   ```

5. Abre http://localhost:3000 en tu navegador. Te va a redirigir a
   `/invitacion/sofia-y-mateo`, que es la invitación de ejemplo.

## Estructura

```
app/
  page.tsx                      -> redirige a la invitación de ejemplo
  invitacion/[slug]/page.tsx    -> vista pública, arma todos los paneles
  layout.tsx                    -> fuentes (Fraunces + Work Sans) y layout raíz
  globals.css                   -> estilos globales + Tailwind

components/
  Divider.tsx                   -> divisor botánico (elemento de firma visual)
  panels/
    Portada.tsx
    CuentaRegresiva.tsx
    FechaLugar.tsx
    Galeria.tsx
    RSVP.tsx                    -> formulario de confirmación (aún no guarda en DB)

lib/
  mock-data.ts                  -> datos de ejemplo, simula lo que vendrá de Supabase
```

## Siguientes pasos (cuando conectes Supabase)

1. Crea el proyecto en https://supabase.com y crea la tabla `events` con las
   columnas que están en `EventData` (lib/mock-data.ts).
2. Instala el cliente: `npm install @supabase/supabase-js`
3. En `app/invitacion/[slug]/page.tsx`, reemplaza `const event = mockEvent`
   por una consulta real usando `params.slug`.
4. En `components/panels/RSVP.tsx`, reemplaza el `console.log` del submit
   por un `insert` a la tabla `guests`.

## Personalizar colores y tipografía

La paleta y las fuentes están centralizadas en `tailwind.config.ts`
(colores: `botanic`, `paper`, `gold`, etc.) y en `app/layout.tsx`
(fuentes de Google Fonts). Cambiar ahí se refleja en toda la app.
