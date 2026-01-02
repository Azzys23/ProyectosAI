
export enum MediaType {
  MOVIE = 'MOVIE',
  GAME = 'GAME'
}

export interface Recommendation {
  id: string;
  user_id: string;
  title: string;
  type: MediaType;
  description: string;
  rating: number;
  created_at: string;
  username?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
}

export interface AIResponse {
  description: string;
  suggestedRating: number;
  similarTitles: string[];
}
