import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, icon, className, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1 transition-colors">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`w-full glass-input rounded-xl py-3 px-4 ${icon ? 'pl-11' : ''} text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-300 ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;