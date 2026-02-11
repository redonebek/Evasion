export enum TravelType {
  ADVENTURE = 'Aventure',
  RELAXATION = 'Détente',
  CULTURAL = 'Culturel',
  BUDGET = 'Budget',
  LUXURY = 'Luxe',
  FAMILY = 'Famille'
}

export interface Activity {
  time: string;
  description: string;
}

export interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
}

export interface Hotel {
  name: string;
  category: string; // e.g. "Luxe", "Charme", "Economique"
  description: string;
}

export interface HistoricalSite {
  name: string;
  description: string;
  ticketPrice: string; // e.g. "15€" or "Gratuit"
}

export interface PracticalInfo {
  currency: string;
  budgetEstimate: string; // e.g. "100-150€ par jour"
  weatherTip: string;
  localDishes: string[]; // Changed from single string to array
}

export interface Itinerary {
  tripTitle: string;
  summary: string;
  destination: string;
  dailyPlans: DayPlan[];
  packingList: string[];
  localTips: string[];
  hotelRecommendations: Hotel[];
  historicalSites: HistoricalSite[];
  practicalInfo: PracticalInfo;
}

export interface PlannerFormData {
  destination: string;
  days: number;
  type: TravelType;
}

export interface ApiError {
  message: string;
}