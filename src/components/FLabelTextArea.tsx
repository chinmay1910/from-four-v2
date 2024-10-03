import React from 'react'

interface FloatingLabelTextAreaProps {
  id: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  width?: string; // New prop for width
}

const FLabelTextArea: React.FC<FloatingLabelTextAreaProps> = ({
  id,
  label,
  placeholder = " ",
  maxLength = 500,
  rows = 3,
  width = 'w-full', // Default to full width
}) => {
  const clampedRows = Math.min(Math.max(1, rows), 5);
  const lineHeight = 1.5; // Adjust this value based on your desired line height
  const paddingTop = 1.5; // in rem, adjust as needed
  const paddingBottom = 0.5; // in rem, adjust as needed

  const textareaHeight = `calc(${clampedRows} * ${lineHeight}rem + ${paddingTop}rem + ${paddingBottom}rem)`;

  return (
    <div className={width}> {/* Apply width class here */}
      <div className="relative">
        <textarea
          id={id}
          maxLength={maxLength}
          rows={clampedRows}
          style={{ height: textareaHeight, minHeight: textareaHeight }}
          className="relative block w-full appearance-none rounded-lg border px-2.5 pt-6 pb-2 shadow-sm outline-none transition sm:text-sm border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-950 disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 peer"
          placeholder={placeholder}
        />
        <label
          htmlFor={id}
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-2 scale-75 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-slate-600 dark:peer-focus:text-slate-300 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1/2 peer-focus:scale-75 peer-focus:-translate-y-2 left-1 top-0 dark:bg-slate-950 dark:text-slate-100"
        >
          {label}
        </label>
      </div>
    </div>
  )
}

export default FLabelTextArea;