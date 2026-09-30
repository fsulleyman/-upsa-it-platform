import React from 'react';

interface FormFieldBaseProps {
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
}

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement>, FormFieldBaseProps {}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  required,
  helperText,
  error,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor={inputId} className="block text-xs font-semibold text-slate-200">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <input
        id={inputId}
        required={required}
        className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
          error ? 'border-rose-500/80 focus:ring-rose-500/50' : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
        } text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] font-medium text-rose-400 mt-1">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
};

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, FormFieldBaseProps {
  options: Array<{ value: string; label: string }>;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  required,
  helperText,
  error,
  options,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor={selectId} className="block text-xs font-semibold text-slate-200">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <select
        id={selectId}
        required={required}
        className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
          error ? 'border-rose-500/80 focus:ring-rose-500/50' : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
        } text-white text-xs focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] font-medium text-rose-400 mt-1">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
};

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, FormFieldBaseProps {}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  label,
  required,
  helperText,
  error,
  className = '',
  id,
  rows = 3,
  ...props
}) => {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5 w-full">
      <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-200">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <textarea
        id={textareaId}
        required={required}
        rows={rows}
        className={`w-full px-3 py-2 rounded-lg bg-slate-900 border ${
          error ? 'border-rose-500/80 focus:ring-rose-500/50' : 'border-slate-800 focus:border-blue-500 focus:ring-blue-500/30'
        } text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] font-medium text-rose-400 mt-1">{error}</p>}
      {!error && helperText && <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>}
    </div>
  );
};

export interface FormToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const FormToggle: React.FC<FormToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <span className="text-xs font-semibold text-slate-200 block">{label}</span>
        {description && <span className="text-[11px] text-slate-400 block mt-0.5">{description}</span>}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
          checked ? 'bg-blue-600' : 'bg-slate-800'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
