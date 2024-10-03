import React from 'react';

type Option<T extends string> = {
  value: T;
  label: string;
};

type ButtonGroupProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export function ButtonGroup<T extends string>({ options, value, onChange, className = '' }: ButtonGroupProps<T>) {
  return (
    <div className={`inline-flex rounded-md shadow-sm ${className}`} role="group">
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            px-4 py-2 text-sm font-medium border
            ${value === option.value
              ? 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100 hover:text-slate-1000 dark:bg-slate-900 dark:text-slate-100 dark:border-none dark:hover:bg-slate-900 dark:hover:text-slate-50'
              : 'bg-white text-slate-300 border-gray-200 hover:bg-gray-50 hover:text-gray-600 dark:bg-transparent dark:text-slate-400 dark:border-none dark:hover:bg-slate-900 dark:hover:text-slate-300'
            }
            ${index === 0 ? 'rounded-l-lg' : index === options.length - 1 ? 'rounded-r-lg' : ''}
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}