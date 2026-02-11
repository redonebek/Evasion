import React from 'react';
import { DayPlan, Activity } from '../types';
import { 
  Clock, 
  Utensils, 
  Coffee, 
  Sun, 
  Moon, 
  Camera, 
  Landmark, 
  ShoppingBag, 
  Bus, 
  Waves, 
  Mountain, 
  Music, 
  MapPin, 
  BedDouble,
  Palmtree,
  Ticket
} from 'lucide-react';

interface DayCardProps {
  plan: DayPlan;
  index: number;
}

const getIconForActivity = (activity: Activity) => {
  const text = (activity.description + " " + activity.time).toLowerCase();

  // Food & Drink
  if (text.includes('déjeuner') || text.includes('dîner') || text.includes('restaurant') || text.includes('manger') || text.includes('repas') || text.includes('gourmand') || text.includes('gastronomie')) return <Utensils size={18} />;
  if (text.includes('petit-déjeuner') || text.includes('café') || text.includes('brunch') || text.includes('pause')) return <Coffee size={18} />;
  
  // Nature & Water
  if (text.includes('plage') || text.includes('mer') || text.includes('océan') || text.includes('nautique') || text.includes('baignade') || text.includes('lac') || text.includes('croisière') || text.includes('bateau')) return <Waves size={18} />;
  if (text.includes('montagne') || text.includes('randonnée') || text.includes('trek') || text.includes('nature') || text.includes('parc') || text.includes('jardin') || text.includes('forêt')) return <Mountain size={18} />;
  if (text.includes('palmier') || text.includes('tropical') || text.includes('île')) return <Palmtree size={18} />;

  // Culture & Sightseeing
  if (text.includes('musée') || text.includes('galerie') || text.includes('histoire') || text.includes('temple') || text.includes('culture') || text.includes('monument') || text.includes('château') || text.includes('palais') || text.includes('visite')) return <Landmark size={18} />;
  if (text.includes('photo') || text.includes('vue') || text.includes('panorama') || text.includes('tour')) return <Camera size={18} />;
  if (text.includes('spectacle') || text.includes('théâtre') || text.includes('entrée') || text.includes('ticket')) return <Ticket size={18} />;

  // Activities
  if (text.includes('shopping') || text.includes('boutique') || text.includes('marché') || text.includes('souvenir') || text.includes('centre commercial')) return <ShoppingBag size={18} />;
  if (text.includes('soir') || text.includes('nuit') || text.includes('club') || text.includes('bar') || text.includes('concert') || text.includes('fête')) return <Music size={18} />;
  
  // Transit & Accommodation
  if (text.includes('bus') || text.includes('train') || text.includes('transfert') || text.includes('vol') || text.includes('aéroport') || text.includes('route') || text.includes('trajet') || text.includes('taxi') || text.includes('métro')) return <Bus size={18} />;
  if (text.includes('hôtel') || text.includes('repos') || text.includes('détente') || text.includes('spa') || text.includes('hébergement') || text.includes('check-in')) return <BedDouble size={18} />;
  
  // Time specific fallbacks
  if (text.includes('matin')) return <Sun size={18} />;
  if (text.includes('soir')) return <Moon size={18} />;
  
  return <MapPin size={18} />;
};

const DayCard: React.FC<DayCardProps> = ({ plan, index }) => {
  return (
    <div 
      className="glass-panel rounded-3xl p-1 hover:border-teal-500/30 dark:hover:border-teal-400/20 transition-all duration-500 animate-fade-in-up group mb-8"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="bg-white/30 dark:bg-black/20 rounded-[22px] p-6 md:p-8 h-full">
        {/* Header of the Day */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200/50 dark:border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/20 shrink-0">
              <span className="text-xs font-medium uppercase opacity-80">Jour</span>
              <span className="text-2xl font-bold leading-none">{plan.day}</span>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                {plan.theme}
              </h3>
            </div>
          </div>
        </div>

        {/* Timeline Activities */}
        <div className="space-y-0 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[19px] top-4 bottom-6 w-[2px] bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>

          {plan.activities.map((activity, idx) => (
            <div key={idx} className="relative pl-16 pb-10 last:pb-0 group/activity">
              {/* Icon Bubble */}
              <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-teal-100 dark:border-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm z-10 group-hover/activity:scale-110 group-hover/activity:border-teal-400 group-hover/activity:bg-white dark:group-hover/activity:bg-slate-700 transition-all duration-300">
                {getIconForActivity(activity)}
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 pt-1">
                <div className="shrink-0 w-24">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-100 dark:border-teal-500/20">
                    <Clock size={10} strokeWidth={3} />
                    {activity.time}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[15px] group-hover/activity:text-slate-900 dark:group-hover/activity:text-white transition-colors">
                    {activity.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayCard;