import { TravelType } from './types';

export const TRAVEL_TYPES = [
  { value: TravelType.ADVENTURE, label: '🧗 Aventure', color: 'text-orange-400' },
  { value: TravelType.RELAXATION, label: '🧘 Détente', color: 'text-teal-400' },
  { value: TravelType.CULTURAL, label: '🏛️ Culturel', color: 'text-purple-400' },
  { value: TravelType.BUDGET, label: '💸 Budget', color: 'text-green-400' },
  { value: TravelType.LUXURY, label: '💎 Luxe', color: 'text-yellow-400' },
  { value: TravelType.FAMILY, label: '👨‍👩‍👧‍👦 Famille', color: 'text-blue-400' },
];

export const MAX_DAYS = 21;
export const MIN_DAYS = 1;