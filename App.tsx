
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser, loginUser, getRecommendations, addRecommendation, isSupabaseConfigured } from './lib/supabase';
import { generateRecommendationDetails } from './services/geminiService';
import { Recommendation, MediaType } from './types';
import RecommendationCard from './components/RecommendationCard';

// --- Docs Component ---
const Documentation: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 animate-in fade-in duration-700">
      <h2 className="text-5xl font-black text-white mb-8 italic uppercase tracking-tighter">Guía Técnica<span className="text-indigo-500">.</span></h2>
      
      <div className="space-y-12">
        <section>
          <h3 className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-4">01. Arquitectura</h3>
          <p className="text-slate-400 leading-relaxed mb-6">
            Suckador utiliza una arquitectura **Serverless**. El frontend consume directamente la API de Google Gemini para procesamiento de lenguaje natural y Supabase para la persistencia de datos en tiempo real.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <span className="block text-white font-black mb-2 italic">UI</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">React + Tailwind</span>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <span className="block text-white font-black mb-2 italic">IA</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Gemini 3 Flash</span>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <span className="block text-white font-black mb-2 italic">DB</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Supabase PG</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em] mb-4">02. Base de Datos</h3>
          <p className="text-slate-400 leading-relaxed mb-4">Para que el sistema sea persistente, debes ejecutar este SQL en tu panel de Supabase:</p>
          <pre className="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto text-[11px] text-indigo-300 font-mono">
{`create table recommendations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  username text not null,
  title text not null,
  type text not null,
  description text not null,
  rating numeric default 10
);`}
          </pre>
        </section>

        <section>
          <h3 className="text-purple-400 font-black text-xs uppercase tracking-[0.3em] mb-4">03. Modo de Despliegue</h3>
          <p className="text-slate-400 leading-relaxed">
            Recomendamos **Vercel** para el despliegue. Simplemente conecta tu repo de GitHub y la configuración ESM se encargará del resto. Asegúrate de inyectar las claves de API en la configuración del proyecto.
          </p>
        </section>
      </div>
    </div>
  );
};

// --- Home Component ---
const Home: React.FC = () => {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [filter, setFilter] = useState<MediaType | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const hasSupabase = isSupabaseConfigured();

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getRecommendations(filter);
      setRecs(data);
    } catch (err) {
      console.error("Error al obtener datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location, filter]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {!hasSupabase && (
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
          <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">
            ⚠️ Atención: Supabase no está configurado. Los datos se borrarán al recargar.
          </p>
        </div>
      )}

      <div className="text-center mb-16">
        <h1 className="text-7xl font-black tracking-tighter text-white mb-4 uppercase italic">
          SUCKADOR<span className="text-indigo-600">.</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium tracking-[0.2em] uppercase">Comparte lo que realmente vale la pena</p>
      </div>

      <div className="flex justify-center mb-16">
        <div className="inline-flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl">
          {(['ALL', MediaType.MOVIE, MediaType.GAME] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                filter === type ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {type === 'ALL' ? 'Explorar' : type === MediaType.MOVIE ? 'Cine' : 'Gaming'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-12 h-12 border-[6px] border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Sincronizando Base de Datos</p>
          </div>
        ) : recs.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/20 rounded-[40px] border border-slate-800 border-dashed">
            <p className="text-slate-500 font-medium italic mb-6">"Todavía no hay nada aquí. Sé el primero en recomendar."</p>
            <Link to="/recomendar" className="bg-white text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">Empezar Lista</Link>
          </div>
        ) : (
          <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {recs.map(rec => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Form Recommendation Component ---
const InitialRecommendation: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(getCurrentUser()?.username || '');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>(MediaType.MOVIE);
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(10);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleMagicFill = async () => {
    if (!title) return alert("Escribe el título primero");
    setAiLoading(true);
    try {
      const aiData = await generateRecommendationDetails(title, type);
      setDescription(aiData.description);
      setRating(aiData.suggestedRating);
    } catch (err) {
      console.error(err);
      alert("La IA está descansando. Inténtalo de nuevo.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return alert('Dinos quién eres');
    if (!title || !description) return alert('Faltan datos por rellenar');

    setLoading(true);
    try {
      const user = loginUser(username);
      await addRecommendation({
        user_id: user.id,
        username: user.username,
        title,
        type,
        description,
        rating
      });
      onLogin();
      navigate('/');
    } catch (err: any) {
      console.error(err);
      alert("Error al guardar. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[40px] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
        
        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">RECOMENDAR<span className="text-indigo-500">.</span></h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Deja tu marca en la comunidad</p>
        
        <form onSubmit={handleStart} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Tu Alias</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all font-bold"
                placeholder="Ej: MasterGamer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Tu Nota (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                step="0.1"
                required
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">¿Qué recomiendas?</label>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setType(MediaType.MOVIE)}
                className={`py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${type === MediaType.MOVIE ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/20 scale-105' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                🎬 Cine
              </button>
              <button
                type="button"
                onClick={() => setType(MediaType.GAME)}
                className={`py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${type === MediaType.GAME ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl shadow-emerald-600/20 scale-105' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                🎮 Gaming
              </button>
            </div>
            
            <div className="relative">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Título</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all font-bold pr-32"
                placeholder="Nombre de la obra..."
              />
              <button
                type="button"
                onClick={handleMagicFill}
                disabled={aiLoading}
                className="absolute right-2 bottom-2 bg-slate-800 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {aiLoading ? '✨ BUSCANDO...' : '✨ USAR IA'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Reseña</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 resize-none transition-all font-medium italic"
              placeholder="¿Por qué es especial? (O usa el botón mágico arriba)"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-2xl disabled:opacity-50 active:scale-95 text-xs uppercase tracking-[0.3em]"
          >
            {loading ? 'SINCRONIZANDO...' : 'PUBLICAR EN SUCKADOR'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- App Principal ---
const App: React.FC = () => {
  const [user, setUser] = useState(getCurrentUser());
  const handleUpdateUser = () => setUser(getCurrentUser());

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200">
        <nav className="border-b border-slate-900/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 h-24 flex items-center justify-between">
            <Link to="/" className="font-black text-3xl tracking-tighter hover:text-indigo-500 transition-colors uppercase italic group">
              SUCKADOR<span className="text-indigo-600 group-hover:animate-ping inline-block">.</span>
            </Link>

            <div className="flex items-center gap-8">
              <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Catálogo</Link>
              <Link to="/docs" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Docs</Link>
              {user && (
                <div className="hidden md:flex items-center gap-4 bg-slate-900 py-2 px-4 rounded-full border border-slate-800">
                  <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{user.username}</span>
                  <button onClick={handleLogout} className="text-[9px] font-black uppercase text-red-500/50 hover:text-red-500 transition-colors">Salir</button>
                </div>
              )}
              <Link 
                to="/recomendar" 
                className="bg-white text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-white/5"
              >
                + Añadir
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recomendar" element={<InitialRecommendation onLogin={handleUpdateUser} />} />
            <Route path="/docs" element={<Documentation />} />
          </Routes>
        </main>

        <footer className="py-24 text-center">
          <div className="w-12 h-1 bg-slate-900 mx-auto mb-10"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700">SUCKADOR • THE ELITE LIST • 2024</p>
          <div className="mt-4">
            <Link to="/docs" className="text-[9px] font-bold text-indigo-500/50 hover:text-indigo-500 uppercase tracking-widest transition-colors">Guía de Configuración</Link>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
