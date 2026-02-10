import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Compass, Sparkles, ArrowLeft, Send, Sun, Moon, Map } from 'lucide-react';
import { generateItinerary } from './services/geminiService';
import { Itinerary, PlannerFormData, TravelType } from './types';
import { TRAVEL_TYPES, MIN_DAYS, MAX_DAYS } from './constants';
import Input from './components/Input';
import Select from './components/Select';
import Button from './components/Button';
import DayCard from './components/DayCard';
import LoadingView from './components/LoadingView';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState<PlannerFormData>({
    destination: '',
    days: 3,
    type: TravelType.RELAXATION
  });
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Apply theme class to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'days' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.destination) {
      setError("Veuillez entrer une destination.");
      return;
    }
    
    setError(null);
    setLoading(true);
    setItinerary(null);

    try {
      const result = await generateItinerary(formData);
      setItinerary(result);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setItinerary(null);
    setFormData({ ...formData, destination: '' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 selection:bg-teal-500/30 selection:text-teal-700 dark:selection:text-teal-200 overflow-x-hidden transition-colors duration-500">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#0f172a] transition-colors duration-700"></div>
        
        {/* Animated Blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 dark:opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-teal-300 dark:bg-teal-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 dark:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-indigo-300 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-40 dark:opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        
        {/* Theme Toggle & Header */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-500/30">
              É
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">Évasion</span>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 text-slate-600 dark:text-yellow-300 hover:scale-110 transition-all shadow-sm cursor-pointer z-50 hover:bg-white/60 dark:hover:bg-white/10"
            aria-label="Changer le thème"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} className="text-slate-600" />}
          </button>
        </nav>

        {!itinerary && (
          <header className="mb-16 text-center relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50/80 dark:bg-teal-900/30 border border-teal-100 dark:border-teal-500/20 text-xs font-semibold text-teal-700 dark:text-teal-300 mb-6 animate-fade-in-down backdrop-blur-sm shadow-sm">
              <Sparkles size={14} className="animate-pulse" />
              <span>Générateur d'itinéraires IA</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-teal-800 to-slate-900 dark:from-white dark:via-teal-200 dark:to-white mb-6 tracking-tight animate-fade-in-down drop-shadow-sm" style={{animationDelay: '100ms', lineHeight: 1.1}}>
              Planifiez votre<br/>prochaine aventure
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-down leading-relaxed" style={{animationDelay: '200ms'}}>
              Laissez notre intelligence artificielle concevoir un voyage sur mesure, jour par jour, adapté à vos envies et votre style.
            </p>
          </header>
        )}

        {/* Main Content Area */}
        <main className="transition-all duration-500 ease-in-out relative">
          
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50/80 border border-red-100 dark:bg-red-900/20 dark:border-red-500/20 text-red-600 dark:text-red-200 text-center animate-shake backdrop-blur-sm">
              {error}
            </div>
          )}

          {!itinerary && !loading && (
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-10 rounded-[2.5rem] animate-fade-in-up relative overflow-hidden group">
                
                {/* Decorative gradients inside form */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
                  <div className="col-span-1 md:col-span-2">
                    <Input
                      label="Destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="Paris, Tokyo, Bali..."
                      icon={<MapPin size={18} />}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="col-span-1">
                     <div className="flex flex-col gap-2 w-full">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Durée</label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
                          <Calendar size={18} />
                        </div>
                        <input
                          type="number"
                          name="days"
                          min={MIN_DAYS}
                          max={MAX_DAYS}
                          value={formData.days}
                          onChange={handleInputChange}
                          className="w-full glass-input rounded-xl py-3 px-4 pl-11 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 font-medium"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">Jours</span>
                      </div>
                    </div>
                    <div className="px-1 mt-2 flex justify-between text-xs font-medium text-slate-400 dark:text-slate-500">
                      <span>{MIN_DAYS} jour min</span>
                      <span>{MAX_DAYS} jours max</span>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <Select
                      label="Ambiance"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      options={TRAVEL_TYPES}
                      icon={<Compass size={18} />}
                    />
                  </div>
                </div>

                <div className="flex justify-center relative z-10">
                  <Button type="submit" isLoading={loading} className="w-full md:w-auto min-w-[240px] text-lg shadow-xl shadow-teal-500/20">
                     <span className="flex items-center justify-center gap-3">
                       Générer l'aventure <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                     </span>
                  </Button>
                </div>
              </form>
            </div>
          )}

          {loading && <LoadingView />}

          {itinerary && (
            <div className="animate-fade-in max-w-4xl mx-auto">
              <div className="mb-8">
                <button 
                  onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 group font-medium"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  Retour à la recherche
                </button>
              </div>

              {/* Itinerary Header / Ticket Style */}
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white/10 dark:to-white/5 p-8 md:p-12 mb-12 text-white shadow-2xl shadow-slate-900/20 animate-fade-in-up">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-b from-teal-500/30 to-purple-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
                  <div className="flex-1">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest mb-4 text-teal-300">
                        Destination confirmée
                     </div>
                     <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                      {itinerary.tripTitle}
                     </h2>
                     <p className="text-lg text-slate-300 leading-relaxed max-w-2xl border-l-2 border-teal-500 pl-6">
                       {itinerary.summary}
                     </p>
                  </div>
                  <div className="flex md:flex-col gap-4 shrink-0 bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                     <div className="text-center p-2">
                        <span className="block text-sm text-slate-400 uppercase tracking-wider mb-1">Durée</span>
                        <span className="text-2xl font-bold">{formData.days} Jours</span>
                     </div>
                     <div className="w-px h-12 md:w-full md:h-px bg-white/10"></div>
                     <div className="text-center p-2">
                        <span className="block text-sm text-slate-400 uppercase tracking-wider mb-1">Style</span>
                        <span className="text-xl font-bold capitalize">{formData.type}</span>
                     </div>
                  </div>
                </div>
              </div>

              {/* Timeline List */}
              <div className="space-y-2">
                 {itinerary.dailyPlans.map((plan, index) => (
                   <DayCard key={plan.day} plan={plan} index={index} />
                 ))}
              </div>
              
              <div className="mt-16 text-center pb-8 border-t border-slate-200 dark:border-slate-800 pt-8">
                <p className="text-slate-400 dark:text-slate-500 text-sm flex items-center justify-center gap-2">
                  <Sparkles size={14} />
                  Itinéraire généré par Gemini AI • Vérifiez les disponibilités locales
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Global CSS for custom animations that Tailwind doesn't have by default */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes progress-indeterminate {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
         @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-progress-indeterminate { animation: progress-indeterminate 2s infinite linear; }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

export default App;