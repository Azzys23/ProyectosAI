
import { GoogleGenAI, Type } from "@google/genai";
import { MediaType, AIResponse } from "../types";

// Always use the process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRecommendationDetails = async (title: string, type: MediaType): Promise<AIResponse> => {
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Actúa como un experto en entretenimiento. Proporciona detalles para una recomendación de un ${type === MediaType.MOVIE ? 'película' : 'videojuego'} llamado "${title}". 
  Necesito una descripción breve y atractiva (máximo 300 caracteres), una calificación sugerida del 1 al 10 y una lista de 3 títulos similares.`;

  // Querying GenAI with model and prompt in a single call.
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          suggestedRating: { type: Type.NUMBER },
          similarTitles: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["description", "suggestedRating", "similarTitles"]
      }
    }
  });

  // Extract text and trim before parsing as per guidelines.
  const jsonStr = response.text.trim();
  return JSON.parse(jsonStr) as AIResponse;
};
