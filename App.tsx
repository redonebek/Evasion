import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Compass, Sparkles, ArrowLeft, Send, Sun, Moon, Map, Share2, Copy, Check, Link as LinkIcon, Info, Backpack, Wallet, Lightbulb, Utensils, FileText, ChevronRight, BedDouble, Star, Landmark, Ticket } from 'lucide-react';
import { generateItinerary } from './services/geminiService';
import { exportToPdf } from './services/pdfService';
import { Itinerary, PlannerFormData, TravelType } from './types';
import { TRAVEL_TYPES, MIN_DAYS, MAX_DAYS } from './constants';
import Input from './components/Input';
import Select from './components/Select';
import Button from './components/Button';
import DayCard from './components/DayCard';
import LoadingView from './components/LoadingView';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState<PlannerFormData>({
    destination: '',
    days: 3,
    type: TravelType.RELAXATION
  });
  
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'itinerary' | 'essentials' | 'tips'>('itinerary');
  
  // Filter state for hotels
  const [hotelFilter, setHotelFilter] = useState<string>('Confort');

  useEffect(() => {
    // Apply theme class to html element
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash.startsWith('#share=')) {
        try {
          const encoded = window.location.hash.substring(7); // remove #share=
          // Decode Base64 with Unicode support
          const json = decodeURIComponent(escape(window.atob(encoded)));
          const sharedItinerary = JSON.parse(json);
          
          if (sharedItinerary && sharedItinerary.dailyPlans) {
            setItinerary(sharedItinerary);
            setFormData(prev => ({
              ...prev,
              destination: sharedItinerary.destination,
              days: sharedItinerary.dailyPlans.length,
            }));
            // Remove hash to clean URL without reloading
            history.pushState("", document.title, window.location.pathname + window.location.search);
            showNotification("Itinéraire chargé depuis le lien partagé !");
          }
        } catch (e) {
          console.error("Error parsing share link", e);
          setError("Le lien partagé semble invalide ou a expiré.");
        }
      }
    };
    
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

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
    setActiveTab('itinerary');
    setHotelFilter('Confort');

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
    setError(null);
    setActiveTab('itinerary');
    setHotelFilter('Confort');
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCopyLink = () => {
    if (!itinerary) return;
    try {
      const json = JSON.stringify(itinerary);
      // Encode Base64 with Unicode support
      const encoded = window.btoa(unescape(encodeURIComponent(json)));
      const url = `${window.location.origin}${window.location.pathname}#share=${encoded}`;
      navigator.clipboard.writeText(url).then(() => {
        showNotification("Lien copié ! Partagez votre voyage.");
      });
    } catch (e) {
      console.error("Encoding error", e);
      showNotification("Erreur lors de la création du lien.");
    }
  };

  const handleCopyText = () => {
    if (!itinerary) return;
    let text = `🌍 Voyage à ${itinerary.destination}\n✨ ${itinerary.tripTitle}\n\n`;
    text += `${itinerary.summary}\n\n`;
    
    // Add Practical Infos to copy
    if (itinerary.practicalInfo) {
       text += `💰 Budget: ${itinerary.practicalInfo.budgetEstimate}\n`;
       if (itinerary.practicalInfo.localDishes && itinerary.practicalInfo.localDishes.length > 0) {
         text += `🍽️ Spécialités: ${itinerary.practicalInfo.localDishes.join(', ')}\n\n`;
       }
    }

    itinerary.dailyPlans.forEach(day => {
        text += `📅 Jour ${day.day}: ${day.theme}\n`;
        day.activities.forEach(act => {
            text += `• ${act.time}: ${act.description}\n`;
        });
        text += `\n`;
    });
    
    text += `Généré par Évasion`;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification("Itinéraire copié en texte !");
    });
  };

  const handleExportPdf = () => {
    if (!itinerary) return;
    exportToPdf(itinerary);
    showNotification("Téléchargement du PDF commencé !");
  };

  const getCategoryColor = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('luxe')) return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700/50";
    if (lower.includes('confort') || lower.includes('qualité')) return "bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-200 border-teal-200 dark:border-teal-700/50";
    if (lower.includes('budget') || lower.includes('economique')) return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/50";
    return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 selection:bg-teal-500/30 selection:text-teal-700 dark:selection:text-teal-200 overflow-x-hidden transition-colors duration-500">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-xl flex items-center gap-3 font-medium">
            <Check size={18} className="text-teal-500" />
            {notification}
          </div>
        </div>
      )}

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white dark:from-[#0f172a] dark:via-[#1e1b4b] dark:to-[#0f172a] transition-colors duration-700"></div>
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
              Laissez notre intelligence artificielle concevoir un voyage sur mesure, avec budget et conseils locaux.
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
              <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <button 
                  onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 group font-medium"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  Retour à la recherche
                </button>

                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <Button variant="secondary" onClick={handleExportPdf} className="flex-1 sm:flex-none !py-3 !px-5 text-sm">
                     <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                      <FileText size={16} /> <span className="hidden sm:inline">PDF</span>
                     </span>
                  </Button>
                  <Button variant="secondary" onClick={handleCopyLink} className="flex-1 sm:flex-none !py-3 !px-5 text-sm">
                     <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                      <LinkIcon size={16} /> <span className="hidden sm:inline">Lien</span>
                     </span>
                  </Button>
                  <Button variant="secondary" onClick={handleCopyText} className="flex-1 sm:flex-none !py-3 !px-5 text-sm">
                     <span className="flex items-center justify-center gap-2 whitespace-nowrap">
                       <Copy size={16} /> <span className="hidden sm:inline">Copier</span>
                     </span>
                  </Button>
                </div>
              </div>

              {/* Itinerary Header */}
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white/10 dark:to-white/5 p-8 md:p-12 mb-8 text-white shadow-2xl shadow-slate-900/20 animate-fade-in-up">
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
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex p-1 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-2xl mb-8 border border-white/20 overflow-x-auto">
                <button 
                  onClick={() => setActiveTab('itinerary')}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 ${activeTab === 'itinerary' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' : 'text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-white/5'}`}
                >
                  <Map size={16} />
                  Itinéraire
                </button>
                <button 
                  onClick={() => setActiveTab('essentials')}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 ${activeTab === 'essentials' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' : 'text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-white/5'}`}
                >
                  <Backpack size={16} />
                  Valise & Budget
                </button>
                <button 
                  onClick={() => setActiveTab('tips')}
                  className={`flex-1 min-w-[120px] py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 ${activeTab === 'tips' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' : 'text-slate-600 dark:text-slate-400 hover:bg-white/30 dark:hover:bg-white/5'}`}
                >
                  <Lightbulb size={16} />
                  Infos & Conseils
                </button>
              </div>

              {/* Tab Content */}
              <div className="animate-fade-in-up">
                
                {/* ITINERARY TAB */}
                {activeTab === 'itinerary' && (
                  <div className="space-y-2">
                    {itinerary.dailyPlans.map((plan, index) => (
                      <DayCard key={plan.day} plan={plan} index={index} />
                    ))}
                  </div>
                )}

                {/* ESSENTIALS TAB */}
                {activeTab === 'essentials' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Packing List */}
                    <div className="glass-panel rounded-[2rem] p-8 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Backpack size={120} />
                       </div>
                       <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
                         <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                           <Backpack size={20} />
                         </div>
                         Valise Intelligente
                       </h3>
                       <ul className="space-y-3 relative z-10">
                         {itinerary.packingList?.map((item, idx) => (
                           <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/5">
                             <div className="w-5 h-5 rounded-full border-2 border-indigo-400 flex items-center justify-center mt-0.5">
                               <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>
                             </div>
                             <span className="text-slate-700 dark:text-slate-200 font-medium">{item}</span>
                           </li>
                         )) || <p>Aucune liste disponible.</p>}
                       </ul>
                    </div>

                    {/* Budget & Money */}
                    <div className="glass-panel rounded-[2rem] p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Wallet size={120} />
                       </div>
                       <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
                         <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                           <Wallet size={20} />
                         </div>
                         Budget & Monnaie
                       </h3>
                       <div className="space-y-6 relative z-10">
                         <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20">
                           <span className="block text-sm text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Estimation Journalière</span>
                           <span className="text-3xl font-bold text-slate-800 dark:text-white">{itinerary.practicalInfo?.budgetEstimate || "N/A"}</span>
                           <p className="text-xs text-slate-500 mt-1">Par personne (hors vols)</p>
                         </div>
                         
                         <div className="flex items-center gap-4">
                           <div className="flex-1 p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/5">
                              <span className="block text-xs text-slate-500 uppercase tracking-wider mb-1">Devise</span>
                              <span className="text-lg font-bold text-slate-800 dark:text-white">{itinerary.practicalInfo?.currency || "N/A"}</span>
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>
                )}

                {/* TIPS TAB */}
                {activeTab === 'tips' && (
                  <div className="space-y-6">
                    
                    {/* Must-See Historical Sites */}
                    <div className="glass-panel rounded-[2rem] p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Landmark size={120} />
                      </div>
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
                        <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                          <Landmark size={20} />
                        </div>
                        Sites Incontournables
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                        {itinerary.historicalSites?.map((site, idx) => (
                          <div key={idx} className="flex flex-col p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-500/30 transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-2">
                               <h4 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                                {site.name}
                              </h4>
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-xs font-bold whitespace-nowrap border border-rose-100 dark:border-rose-800/50">
                                <Ticket size={12} /> {site.ticketPrice}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {site.description}
                            </p>
                          </div>
                        )) || (
                          <div className="col-span-2 text-center text-slate-500 italic">
                            Aucun site historique disponible.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hotel Recommendations Section */}
                    <div className="glass-panel rounded-[2rem] p-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <BedDouble size={120} />
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                        <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                            <BedDouble size={20} />
                          </div>
                          Hébergements
                        </h3>
                        
                        {/* Filter Buttons */}
                        <div className="flex bg-white/40 dark:bg-white/5 p-1 rounded-xl backdrop-blur-sm border border-white/20 overflow-x-auto max-w-full">
                          {['Luxe', 'Confort', 'Budget'].map((filter) => (
                            <button
                              key={filter}
                              onClick={() => setHotelFilter(filter)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                                hotelFilter === filter
                                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/10'
                              }`}
                            >
                              {filter}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
                        {itinerary.hotelRecommendations
                          ?.filter(h => h.category.toLowerCase().includes(hotelFilter.toLowerCase()))
                          .map((hotel, idx) => (
                          <div key={idx} className="flex flex-col p-5 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all duration-300 group animate-fade-in-up" style={{animationDelay: `${idx * 50}ms`}}>
                            <div className="mb-3">
                              <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getCategoryColor(hotel.category)}`}>
                                {hotel.category}
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2 leading-tight">
                              {hotel.name}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {hotel.description}
                            </p>
                          </div>
                        ))}
                        {(!itinerary.hotelRecommendations || itinerary.hotelRecommendations.length === 0 || 
                           (itinerary.hotelRecommendations.filter(h => h.category.toLowerCase().includes(hotelFilter.toLowerCase())).length === 0)
                        ) && (
                          <div className="col-span-3 text-center text-slate-500 italic py-8">
                            Aucun hébergement trouvé pour cette catégorie.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Local Tips */}
                    <div className="glass-panel rounded-[2rem] p-8">
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-white">
                         <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                           <Lightbulb size={20} />
                         </div>
                         Conseils Locaux
                       </h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {itinerary.localTips?.map((tip, idx) => (
                           <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-500/10 flex gap-3">
                             <Info className="shrink-0 text-amber-500 mt-1" size={18} />
                             <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{tip}</p>
                           </div>
                         )) || <p>Aucun conseil disponible.</p>}
                       </div>
                    </div>

                    {/* Food & Weather */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="glass-panel rounded-[2rem] p-6 flex flex-col items-start gap-4">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center shrink-0">
                                <Utensils size={24} />
                             </div>
                             <h4 className="font-bold text-lg text-slate-800 dark:text-white">À goûter absolument</h4>
                          </div>
                          
                          <div className="w-full mt-2">
                             {itinerary.practicalInfo?.localDishes && itinerary.practicalInfo.localDishes.length > 0 ? (
                               <ul className="space-y-3">
                                 {itinerary.practicalInfo.localDishes.map((dish, idx) => (
                                   <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-orange-50/50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/10">
                                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></div>
                                      <span className="text-slate-600 dark:text-slate-300 italic text-sm">{dish}</span>
                                   </li>
                                 ))}
                               </ul>
                             ) : (
                               <p className="text-slate-600 dark:text-slate-300 italic">"Spécialité locale"</p>
                             )}
                          </div>
                       </div>

                       <div className="glass-panel rounded-[2rem] p-6 flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900/30 text-sky-500 flex items-center justify-center shrink-0">
                             <Sun size={24} />
                          </div>
                          <div>
                             <h4 className="font-bold text-lg text-slate-800 dark:text-white mb-1">Météo & Saison</h4>
                             <p className="text-slate-600 dark:text-slate-300">{itinerary.practicalInfo?.weatherTip || "Vérifiez la météo avant de partir"}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

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