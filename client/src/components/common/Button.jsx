import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:opacity-40 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-zinc-100 text-zinc-900 hover:bg-white border border-zinc-200 active:bg-zinc-200 shadow-xs dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white',
    accent: 'bg-blue-600 text-white hover:bg-blue-500 border border-blue-500/80 active:bg-blue-700 shadow-xs',
    secondary: 'bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 hover:border-zinc-700 active:bg-zinc-900',
    outline: 'border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-zinc-100 bg-transparent',
    ghost: 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60',
    danger: 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/60 active:bg-rose-900'
  };

  const sizes = {
    xs: 'text-[11px] h-6 px-2 gap-1 rounded',
    sm: 'text-xs h-7 px-2.5 gap-1.5 rounded-md',
    md: 'text-xs h-8 px-3.5 gap-2 rounded-md font-medium',
    lg: 'text-sm h-9 px-4 gap-2 rounded-md'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
