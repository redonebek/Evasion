import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  icon?: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, options, icon, className, ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-slate-600 dark:text-slate-300 ml-1 transition-colors">{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors">
            {icon}
          </div>
        )}
        <select
          className={`w-full glass-input rounded-xl py-3 px-4 ${icon ? 'pl-11' : ''} text-slate-900 dark:text-slate-100 appearance-none cursor-pointer transition-all duration-300 ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Select;