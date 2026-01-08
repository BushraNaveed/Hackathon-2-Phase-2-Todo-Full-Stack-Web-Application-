import React from 'react';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', icon: Icon, className, isLoading, disabled, ...props }, ref) => {
    const buttonClasses = clsx(
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      {
        // Variants
        'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
        'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
        'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
        'bg-transparent text-gray-900 hover:bg-gray-100': variant === 'ghost',

        // Sizes
        'h-9 px-3 py-2 text-sm': size === 'sm',
        'h-10 px-4 py-2 text-base': size === 'md',
        'h-12 px-6 py-3 text-lg': size === 'lg',

        // States
        'opacity-50 cursor-not-allowed': isLoading || disabled,
      },
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          <>
            {Icon && <Icon className={`mr-2 h-4 w-4`} />}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };