
# SUCKADOR. 🎬🎮

**Suckador** es una plataforma de curación de contenido impulsada por IA, diseñada para crear listas de películas y videojuegos recomendados por la comunidad.

## 🚀 Tecnologías
- **Frontend**: React (ESM) + Tailwind CSS.
- **IA**: Google Gemini API (`gemini-3-flash-preview`) para autocompletado de reseñas.
- **Backend/DB**: Supabase (PostgreSQL) para persistencia en tiempo real.
- **Routing**: React Router DOM.

## 🛠️ Configuración de Base de Datos (Supabase)

1. Crea un nuevo proyecto en [Supabase](https://supabase.com).
2. En el **SQL Editor**, ejecuta el siguiente comando para crear la tabla necesaria:

```sql
-- Crear tabla de recomendaciones
create table recommendations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  username text not null,
  user_id text not null,
  title text not null,
  type text not null, -- 'MOVIE' o 'GAME'
  description text not null,
  rating numeric default 10
);

-- Habilitar Políticas de Seguridad (RLS)
alter table recommendations enable row level security;

-- Política: Cualquiera puede leer
create policy "Lectura pública" on recommendations for select using (true);

-- Política: Cualquiera puede insertar (Modo Demo)
create policy "Inserción pública" on recommendations for insert with check (true);
```

## 🔑 Variables de Entorno

Para que la app funcione al 100%, necesitas configurar estas variables en tu servicio de Hosting (Vercel/Netlify):

- `API_KEY`: Tu clave de Google AI Studio (Gemini).
- `SUPABASE_URL`: La URL de tu proyecto Supabase.
- `SUPABASE_ANON_KEY`: La clave anónima de tu proyecto Supabase.

## 📦 Despliegue

1. Sube este código a un repositorio de **GitHub**.
2. Conecta el repositorio a **Vercel**.
3. Configura las variables de entorno mencionadas arriba.
4. ¡Listo! La app se compilará y estará viva en una URL pública.

---
*Desarrollado con ❤️ y IA para la comunidad de entretenimiento.*
