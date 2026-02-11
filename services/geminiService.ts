import { GoogleGenAI, Type } from "@google/genai";
import { PlannerFormData, Itinerary } from "../types";

// Note: In a real production app, you might want to proxy this request 
// or ensure the key is restricted. Here we use process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateItinerary = async (formData: PlannerFormData): Promise<Itinerary> => {
  const { destination, days, type } = formData;

  const prompt = `
    Agis comme un expert en voyage local. Crée un guide de voyage complet pour ${destination}.
    Durée: ${days} jours.
    Style: ${type}.
    Langue: Français.
    
    Je veux:
    1. Un itinéraire jour par jour détaillé.
       IMPORTANT : Pour chaque jour, tu DOIS inclure des suggestions spécifiques pour le déjeuner et le dîner dans les activités.
       Pour ces repas :
       - Mentionne des plats typiques ou gastronomiques de la région.
       - Recommande un restaurant spécifique (nom réel) ou un endroit précis (quartier, type d'établissement) pour déguster ces spécialités.
    2. Une liste intelligente de 5 à 7 objets indispensables à mettre dans la valise pour cette destination spécifique.
    3. Des conseils locaux (coutumes, pièges à éviter).
    4. 9 Recommandations d'hébergement réparties strictement en 3 catégories :
       - 3 options "Luxe" (Haut de gamme, charme exceptionnel)
       - 3 options "Confort" (Bon rapport qualité/prix, bien situé)
       - 3 options "Budget" (Économique, auberge, capsule)
       Groupe les résultats dans cet ordre : Luxe, puis Confort, puis Budget.
    5. Une liste de 4 sites historiques ou culturels incontournables (monuments, musées, lieux emblématiques) avec le prix approximatif du billet (ou "Gratuit").
    6. Des infos pratiques (budget estimé par jour, liste de 3 à 5 spécialités culinaires locales incontournables).
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
            tripTitle: { type: Type.STRING, description: "Titre évocateur" },
            summary: { type: Type.STRING, description: "Résumé inspirant" },
            destination: { type: Type.STRING },
            dailyPlans: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  theme: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ["time", "description"]
                    }
                  }
                },
                required: ["day", "theme", "activities"]
              }
            },
            packingList: {
              type: Type.ARRAY,
              description: "Liste de 5-7 objets spécifiques à emporter",
              items: { type: Type.STRING }
            },
            localTips: {
              type: Type.ARRAY,
              description: "3-4 conseils culturels ou pratiques",
              items: { type: Type.STRING }
            },
            hotelRecommendations: {
              type: Type.ARRAY,
              description: "Liste de 9 hôtels (3 par catégorie: Luxe, Confort, Budget)",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Nom de l'hôtel ou du quartier" },
                  category: { type: Type.STRING, description: "Doit être 'Luxe', 'Confort' ou 'Budget'" },
                  description: { type: Type.STRING, description: "Pourquoi choisir cet endroit" }
                },
                required: ["name", "category", "description"]
              }
            },
            historicalSites: {
              type: Type.ARRAY,
              description: "4 sites incontournables",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Nom du site" },
                  description: { type: Type.STRING, description: "Bref descriptif historique/culturel" },
                  ticketPrice: { type: Type.STRING, description: "Prix approx (ex: 12€ ou Gratuit)" }
                },
                required: ["name", "description", "ticketPrice"]
              }
            },
            practicalInfo: {
              type: Type.OBJECT,
              properties: {
                currency: { type: Type.STRING, description: "Devise locale (ex: Yen, Euro)" },
                budgetEstimate: { type: Type.STRING, description: "Estimation budget journalier moyen par personne (hors vol)" },
                weatherTip: { type: Type.STRING, description: "Conseil météo bref" },
                localDishes: { 
                  type: Type.ARRAY, 
                  description: "Liste de 3 à 5 plats typiques à goûter",
                  items: { type: Type.STRING }
                }
              },
              required: ["currency", "budgetEstimate", "weatherTip", "localDishes"]
            }
          },
          required: ["tripTitle", "summary", "destination", "dailyPlans", "packingList", "localTips", "hotelRecommendations", "historicalSites", "practicalInfo"]
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