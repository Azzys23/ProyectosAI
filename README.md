# SUCKADOR. 🎬🎮

**Suckador (The name was a recomendated by a friend) ** is an AI-powered content curation platform designed to create community-driven recommendation lists for movies and video games.

## 🚀 Technologies
- **Frontend**: React (ESM) + Tailwind CSS.
- **AI**: Google Gemini API (`gemini-3-flash-preview`) for automated review generation.
- **Backend/DB**: Supabase (PostgreSQL) for real-time data persistence.
- **Routing**: React Router DOM.

## 🛠️ Database Setup (Supabase)

1. Create a new project at [Supabase](https://supabase.com).
2. In the **SQL Editor**, run the following command to create the required table:

```sql
-- Create recommendations table
create table recommendations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  username text not null,
  user_id text not null,
  title text not null,
  type text not null, -- 'MOVIE' or 'GAME'
  description text not null,
  rating numeric default 10
);

-- Enable Row Level Security (RLS)
alter table recommendations enable row level security;

-- Policy: Anyone can read
create policy "Public Read" on recommendations for select using (true);

-- Policy: Anyone can insert (Demo Mode)
create policy "Public Insert" on recommendations for insert with check (true);
```

## 🔑 Environment Variables

To get the app fully functional, you need to configure these variables in your Hosting service (Vercel/Netlify):

- `API_KEY`: Your Google AI Studio (Gemini) key.
- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key.

## 📦 Deployment

1. Push this code to a **GitHub** repository.
2. Connect the repository to **Vercel**.
3. Configure the environment variables mentioned above.
4. Done! The app will be built and live at a public URL.

---
*Developed with ❤️ and AI for the entertainment community.*
