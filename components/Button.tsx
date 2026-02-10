import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', isLoading, className, ...props }) => {
  const baseStyles = "relative overflow-hidden rounded-2xl font-bold py-4 px-8 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/50 hover:-translate-y-1 hover:brightness-105",
    secondary: "bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 text-slate-600 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10 hover:border-teal-500/30 backdrop-blur-sm"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 relative z-20">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Création en cours...</span>
        </div>
      ) : (
        <div className="relative z-20">
          {children}
        </div>
      )}
    </button>
  );
};

export default Button;