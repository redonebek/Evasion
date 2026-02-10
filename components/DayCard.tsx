import React from 'react';
import { DayPlan } from '../types';
import { Clock, Sun, Moon, Map } from 'lucide-react';

interface DayCardProps {
  plan: DayPlan;
  index: number;
}

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
          <div className="absolute left-[19px] top-2 bottom-6 w-[2px] bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>

          {plan.activities.map((activity, idx) => (
            <div key={idx} className="relative pl-12 pb-8 last:pb-0 group/activity">
              {/* Timeline Dot */}
              <div className="absolute left-[13px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-800 border-2 border-teal-500 group-hover/activity:scale-125 group-hover/activity:border-teal-400 transition-all z-10 shadow-sm"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
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