
import { Recommendation, MediaType } from "../types";

const STORAGE_KEY = 'rechub_recommendations';
const USER_KEY = 'rechub_user';

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export const getStoredRecommendations = (): Recommendation[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  const defaults: Recommendation[] = [
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
      title: 'The Witcher 3',
      type: MediaType.GAME,
      description: 'Geralt de Rivia en su mejor aventura de mundo abierto.',
      rating: 10,
      created_at: new Date().toISOString(),
      username: 'GamerPro'
    }
  ];
  
  if (!data) return defaults;
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaults;
  }
};

export const saveRecommendation = (rec: Omit<Recommendation, 'id' | 'created_at'>) => {
  const all = getStoredRecommendations();
  const newRec: Recommendation = {
    ...rec,
    id: generateId(),
    created_at: new Date().toISOString()
  };
  const updated = [newRec, ...all];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newRec;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const loginUser = (username: string) => {
  const user = { id: generateId(), username };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
};
