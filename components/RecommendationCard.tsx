
import React from 'react';
import { Recommendation, MediaType } from '../types';

interface Props {
  recommendation: Recommendation;
}

const RecommendationCard: React.FC<Props> = ({ recommendation }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Generar estrellas basadas en el rating
  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 2); // Convertir base 10 a base 5
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  return (
    <div className="bg-slate-900/40 border-l-4 border-slate-800 hover:border-indigo-500 p-6 rounded-r-2xl transition-all mb-6 group relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <span className="text-6xl font-black italic uppercase">
          {recommendation.type === MediaType.MOVIE ? 'FILM' : 'GAME'}
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${
              recommendation.type === MediaType.MOVIE ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {recommendation.type === MediaType.MOVIE ? 'Cine' : 'Videojuego'}
            </span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {formatDate(recommendation.created_at)}
            </span>
          </div>
          
          <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight mb-3">
            {recommendation.title}
          </h3>
          
          <div className="text-indigo-500 font-bold text-xs tracking-[0.3em] mb-4">
            {renderStars(recommendation.rating || 10)} <span className="ml-2 text-slate-500">({recommendation.rating}/10)</span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed italic bg-slate-950/30 p-4 rounded-xl border border-white/5">
            "{recommendation.description}"
          </p>
        </div>

        <div className="flex flex-col items-end gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">Posteado por</p>
              <p className="text-xs font-bold text-white uppercase tracking-wider">{recommendation.username || 'Anónimo'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-lg font-black border border-indigo-400/30 shadow-lg shadow-indigo-600/20 transform group-hover:rotate-6 transition-transform">
              {(recommendation.username || 'A')[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
