import React, { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';

const LoadingView: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);
  
  const tips = [
    "Recherche des meilleurs spots...",
    "Organisation de l'itinéraire...",
    "Vérification des disponibilités...",
    "Ajout d'une touche de magie...",
    "Finalisation de votre voyage de rêve..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-teal-500/30 blur-2xl rounded-full"></div>
        <div className="relative bg-gradient-to-tr from-teal-500 to-blue-600 p-6 rounded-full shadow-2xl animate-bounce-slow">
          <Plane className="text-white w-12 h-12" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 text-center">Création de votre évasion</h3>
      <div className="h-6 overflow-hidden relative w-full max-w-md text-center">
         <p className="text-slate-500 dark:text-slate-400 transition-all duration-500 animate-pulse">
           {tips[tipIndex]}
         </p>
      </div>

      <div className="mt-8 w-64 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-teal-400 to-blue-500 w-1/2 animate-progress-indeterminate rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingView;