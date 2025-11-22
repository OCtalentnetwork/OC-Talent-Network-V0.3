import React from 'react';

interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  fullWidth?: boolean;
}

const NeoButton: React.FC<NeoButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  let bgClass = 'bg-octn-blue text-white';
  if (variant === 'secondary') bgClass = 'bg-white text-black';
  if (variant === 'accent') bgClass = 'bg-octn-purple text-white';

  return (
    <button
      className={`
        ${fullWidth ? 'w-full' : ''}
        ${bgClass}
        border-2 border-black
        px-6 py-3
        font-bold text-lg uppercase tracking-wider
        shadow-neo transition-all
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-hover
        active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default NeoButton;