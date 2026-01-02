
import { createClient } from '@supabase/supabase-js';
import { Recommendation, MediaType } from '../types';

/**
 * CONFIGURACIÓN DE SUPABASE
 * -------------------------
 * ¡IMPORTANTE!: Reemplaza estos valores con los de tu proyecto en 
 * Settings > API de tu panel de Supabase.
 */
const supabaseUrl = process.env.SUPABASE_URL || 'https://reucnxtjaraylxsyzhab.supabase.co'; 
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldWNueHRqYXJheWx4c3l6aGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNzkwMTEsImV4cCI6MjA4Mjk1NTAxMX0.yhziAlOK6MnP4IS3K6Nabgpv-eebmL2IUIYfCeQJt90';

// Solo inicializamos si tenemos las credenciales
export const supabase = (supabaseUrl && supabaseUrl.startsWith('https://')) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const USER_KEY = 'suckador_user';
const LOCAL_STORAGE_KEY = 'suckador_local_recs';

const getLocalRecs = (): Recommendation[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [
    {
      id: '1',
      user_id: 'system',
      title: 'Inception',
      type: MediaType.MOVIE,
      description: 'Una obra maestra de Nolan sobre los sueños dentro de los sueños.',
      rating: 9.5,
      created_at: new Date().toISOString(),
      username: 'Cinephile99'
    },
    {
      id: '2',
      user_id: 'system',
      title: 'Elden Ring',
      type: MediaType.GAME,
      description: 'Exploración pura y desafíos épicos en las Tierras Entre.',
      rating: 10,
      created_at: new Date().toISOString(),
      username: 'GamerX'
    }
  ];
};

export const getRecommendations = async (filter: string = 'ALL') => {
  if (!supabase) {
    console.warn("Supabase no configurado. Usando modo local.");
    const local = getLocalRecs();
    return filter === 'ALL' ? local : local.filter(r => r.type === filter);
  }

  try {
    let query = supabase
      .from('recommendations')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'ALL') {
      query = query.eq('type', filter);
    }

    const { data, error } = await query;
    
    if (error) {
      // Aquí es donde corregimos el [object Object]
      console.error("Error de Supabase:", error.message, "| Sugerencia:", error.hint);
      return getLocalRecs();
    }
    
    return (data as Recommendation[]) || [];
  } catch (err) {
    console.error("Error crítico de conexión:", err);
    return getLocalRecs();
  }
};

export const addRecommendation = async (rec: Omit<Recommendation, 'id' | 'created_at'>) => {
  if (!supabase) {
    const local = getLocalRecs();
    const newRec: Recommendation = {
      ...rec,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newRec, ...local]));
    return newRec;
  }

  const { data, error } = await supabase
    .from('recommendations')
    .insert([rec])
    .select();
  
  if (error) {
    console.error("Error al insertar:", error.message);
    throw error;
  }
  return data[0];
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const loginUser = (username: string) => {
  const user = { id: Math.random().toString(36).substr(2, 9), username };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const isSupabaseConfigured = () => !!supabase;
