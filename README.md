
# SUCKADOR. 🎬🎮

**Suckador** is an AI-powered content curation platform designed to create community-driven recommendation lists for movies and video games.

## 🚀 Technologies
- **Frontend**: React 19 + Vite.
- **AI**: Google Gemini API (`gemini-3-flash-preview`).
- **Backend/DB**: Supabase (PostgreSQL).
- **Styling**: Tailwind CSS.

## 🌍 Deployment to Vercel (Step by Step)

### 1. Prepare your Repository
Make sure all files (including the new `package.json` and `vite.config.ts`) are pushed to a **GitHub** repository.

### 2. Import to Vercel
1. Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2. Click **"Add New"** > **"Project"**.
3. Import your `Suckador` repository.

### 3. Configure Environment Variables
Before clicking "Deploy", expand the **"Environment Variables"** section and add these three:
- `API_KEY`: (Your Google Gemini Key from AI Studio).
- `SUPABASE_URL`: (Your project URL from Supabase Settings).
- `SUPABASE_ANON_KEY`: (Your project Anon Key from Supabase Settings).

### 4. Build Settings
Vercel should automatically detect **Vite**. If not, ensure these settings are active:
- **Framework Preset**: Vite.
- **Build Command**: `npm run build`.
- **Output Directory**: `dist`.

### 5. Launch!
Click **Deploy**. In less than a minute, your app will be live at a `.vercel.app` URL.

## 🛠️ Database Setup (Supabase)
Run this in your Supabase SQL Editor:
```sql
create table recommendations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  username text not null,
  user_id text not null,
  title text not null,
  type text not null,
  description text not null,
  rating numeric default 10
);

alter table recommendations enable row level security;
create policy "Public Read" on recommendations for select using (true);
create policy "Public Insert" on recommendations for insert with check (true);
```

---
*Developed with ❤️ for the entertainment community.*
