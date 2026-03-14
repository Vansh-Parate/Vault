import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[13px] font-medium text-dark-muted font-sans">
            {label}
            {props.required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 bg-cream-input border border-beige rounded-[8px] text-dark text-sm font-sans placeholder:text-dark-muted focus:border-sage focus:outline-none transition-colors ${error ? 'border-danger' : ''} ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
