import { GoogleGenAI, Type } from "@google/genai";
import { PlannerFormData, Itinerary } from "../types";

// Note: In a real production app, you might want to proxy this request 
// or ensure the key is restricted. Here we use process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItinerary = async (formData: PlannerFormData): Promise<Itinerary> => {
  const { destination, days, type } = formData;

  const prompt = `
    Crée un itinéraire de voyage complet et détaillé pour des vacances à ${destination}.
    Durée: ${days} jours.
    Style de voyage: ${type}.
    Langue: Français.
    
    L'itinéraire doit être réaliste, inclure des activités spécifiques au lieu, et respecter le style de voyage demandé.
    Inclus un titre accrocheur et un résumé inspirant.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tripTitle: { type: Type.STRING, description: "Un titre évocateur pour le voyage" },
            summary: { type: Type.STRING, description: "Un résumé inspirant de l'ambiance du voyage" },
            destination: { type: Type.STRING, description: "La ville ou le pays de destination" },
            dailyPlans: {
              type: Type.ARRAY,
              description: "Liste des plans journaliers",
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER, description: "Numéro du jour" },
                  theme: { type: Type.STRING, description: "Thème principal de la journée" },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING, description: "Moment de la journée (Matin, Midi, Après-midi, Soir)" },
                        description: { type: Type.STRING, description: "Description détaillée de l'activité" }
                      },
                      required: ["time", "description"]
                    }
                  }
                },
                required: ["day", "theme", "activities"]
              }
            }
          },
          required: ["tripTitle", "summary", "destination", "dailyPlans"]
        }
      }
    });

    if (!response.text) {
      throw new Error("Aucune réponse générée par l'IA.");
    }

    const data = JSON.parse(response.text) as Itinerary;
    return data;
  } catch (error) {
    console.error("Erreur Gemini:", error);
    throw new Error("Impossible de générer l'itinéraire. Veuillez vérifier votre clé API ou réessayer plus tard.");
  }
};