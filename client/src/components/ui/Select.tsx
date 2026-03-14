import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[13px] font-medium text-dark-muted font-sans">
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full px-3 py-2 bg-cream-input border border-beige rounded-[8px] text-dark text-sm font-sans focus:border-sage focus:outline-none transition-colors appearance-none cursor-pointer ${error ? 'border-danger' : ''} ${className}`}
          {...props}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
