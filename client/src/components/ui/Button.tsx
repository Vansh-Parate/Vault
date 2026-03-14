import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-sans font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-sage text-white hover:bg-sage-hover',
    ghost: 'border border-beige text-dark-mid hover:bg-cream-input',
    danger: 'bg-danger text-white hover:opacity-90',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-[13px] rounded-[6px]',
    md: 'px-4 py-2 text-sm rounded-[8px]',
    lg: 'px-6 py-3 text-base rounded-[8px]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
