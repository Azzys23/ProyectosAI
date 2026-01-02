
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
      <h2 className="text-5xl font-black text-white mb-8 italic uppercase tracking-tighter">Technical Guide<span className="text-indigo-500">.</span></h2>
      
      <div className="space-y-12">
        <section>
          <h3 className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-4">01. Architecture</h3>
          <p className="text-slate-400 leading-relaxed mb-6">
            Suckador utilizes a **Serverless** architecture. The frontend directly consumes the Google Gemini API for natural language processing and Supabase for real-time data persistence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <span className="block text-white font-black mb-2 italic">UI</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">React + Tailwind</span>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <span className="block text-white font-black mb-2 italic">AI</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Gemini 3 Flash</span>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <span className="block text-white font-black mb-2 italic">DB</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Supabase PG</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-emerald-400 font-black text-xs uppercase tracking-[0.3em] mb-4">02. Database Schema</h3>
          <p className="text-slate-400 leading-relaxed mb-4">To make the system persistent, run this SQL in your Supabase dashboard:</p>
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
          <h3 className="text-purple-400 font-black text-xs uppercase tracking-[0.3em] mb-4">03. Deployment Mode</h3>
          <p className="text-slate-400 leading-relaxed">
            We recommend **Vercel** for deployment. Simply connect your GitHub repo and the ESM configuration will handle the rest. Ensure you inject the API keys in the project settings.
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
      console.error("Error fetching data:", err);
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
            ⚠️ Warning: Supabase is not configured. Data will be lost on refresh.
          </p>
        </div>
      )}

      <div className="text-center mb-16">
        <h1 className="text-7xl font-black tracking-tighter text-white mb-4 uppercase italic">
          SUCKADOR<span className="text-indigo-600">.</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium tracking-[0.2em] uppercase">Share what is actually worth it</p>
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
              {type === 'ALL' ? 'Explore' : type === MediaType.MOVIE ? 'Movies' : 'Gaming'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-12 h-12 border-[6px] border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Syncing Database</p>
          </div>
        ) : recs.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/20 rounded-[40px] border border-slate-800 border-dashed">
            <p className="text-slate-500 font-medium italic mb-6">"Nothing here yet. Be the first to recommend something."</p>
            <Link to="/recomendar" className="bg-white text-black px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">Start List</Link>
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
    if (!title) return alert("Type the title first");
    setAiLoading(true);
    try {
      const aiData = await generateRecommendationDetails(title, type);
      setDescription(aiData.description);
      setRating(aiData.suggestedRating);
    } catch (err) {
      console.error(err);
      alert("AI is resting. Try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return alert('Tell us who you are');
    if (!title || !description) return alert('Missing data');

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
      alert("Error saving. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[40px] p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
        
        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">RECOMMEND<span className="text-indigo-500">.</span></h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-10">Leave your mark in the community</p>
        
        <form onSubmit={handleStart} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Your Alias</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all font-bold"
                placeholder="Ex: MasterGamer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Your Score (1-10)</label>
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
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">What are you recommending?</label>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setType(MediaType.MOVIE)}
                className={`py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all ${type === MediaType.MOVIE ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/20 scale-105' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
              >
                🎬 Cinema
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
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 transition-all font-bold pr-32"
                placeholder="Name of the work..."
              />
              <button
                type="button"
                onClick={handleMagicFill}
                disabled={aiLoading}
                className="absolute right-2 bottom-2 bg-slate-800 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {aiLoading ? '✨ SEARCHING...' : '✨ USE AI'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Review</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-white outline-none focus:border-indigo-500 resize-none transition-all font-medium italic"
              placeholder="Why is it special? (Or use the Magic Button above)"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-2xl disabled:opacity-50 active:scale-95 text-xs uppercase tracking-[0.3em]"
          >
            {loading ? 'SYNCING...' : 'POST TO SUCKADOR'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App ---
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
              <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Catalog</Link>
              <Link to="/docs" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Docs</Link>
              {user && (
                <div className="hidden md:flex items-center gap-4 bg-slate-900 py-2 px-4 rounded-full border border-slate-800">
                  <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{user.username}</span>
                  <button onClick={handleLogout} className="text-[9px] font-black uppercase text-red-500/50 hover:text-red-500 transition-colors">Logout</button>
                </div>
              )}
              <Link 
                to="/recomendar" 
                className="bg-white text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-white/5"
              >
                + Add
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
            <Link to="/docs" className="text-[9px] font-bold text-indigo-500/50 hover:text-indigo-500 uppercase tracking-widest transition-colors">Configuration Guide</Link>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
