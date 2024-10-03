import React from 'react'

interface FloatingLabelInputProps {
  id: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  type?: 'text' | 'number' | 'tel' | 'email' | 'password';
  rows?: number;
  pattern?: string;
  inputMode?: 'numeric' | 'text' | 'tel' | 'email' | 'search';
  min?: number;
  max?: number;
  value?: number | string;
  onChange?: (value: number | string) => void;
}

const FLabel: React.FC<FloatingLabelInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder = " ",
  maxLength = 500,
  pattern,
  inputMode,
  min,
  max,
  value,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      let newValue: number | string = event.target.value;
      if (type === 'number') {
        newValue = event.target.valueAsNumber;
        if (!isNaN(newValue)) {
          if (min !== undefined) newValue = Math.max(min, newValue);
          if (max !== undefined) newValue = Math.min(max, newValue);
        }
      } else if (type === 'text' || type === 'tel' || type === 'email' || type === 'password') {
        // Handle text input types
        newValue = event.target.value; // Keep as string for text inputs
      }
      onChange(newValue);
    }
  };

  return (
    <div>
      <div className="relative">
        <input
          id={id}
          type={type}
          maxLength={maxLength}
          pattern={pattern}
          inputMode={inputMode}
          min={type === 'number' ? min : undefined}
          max={type === 'number' ? max : undefined}
          value={value}
          onChange={handleChange}
          className="relative block w-full appearance-none rounded-lg border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-950 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 pt-4 pb-2.5 peer"
          placeholder={placeholder}
        />
        <label
          htmlFor={id}
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-slate-600 dark:peer-focus:text-slate-300  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 dark:bg-slate-950 dark:text-slate-100"
        >
          {label}
        </label>
      </div>
    </div>
  )
}

export default FLabel;