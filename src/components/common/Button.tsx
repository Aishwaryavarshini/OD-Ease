import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  children,
  className = '',
  glow = false,
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-medium font-mono-tech uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded',
    md: 'text-xs px-4 py-2 gap-2 rounded-md',
    lg: 'text-sm px-6 py-3 gap-2.5 rounded-md font-semibold',
  }[size];

  const variantStyles = {
    primary: 'bg-[#19C7F1] text-[#050B12] hover:bg-[#0EA5E9] font-semibold border border-[#19C7F1] hover:shadow-[0_0_15px_rgba(25,199,241,0.4)]',
    secondary: 'bg-[#0E2430] text-[#E8F5FF] hover:bg-[#173342] border border-[#173342] hover:border-[#19C7F1]/50 hover:text-[#19C7F1]',
    outline: 'bg-transparent text-[#19C7F1] hover:bg-[#19C7F1]/10 border border-[#19C7F1]/60 hover:border-[#19C7F1] shadow-[0_0_10px_-2px_rgba(25,199,241,0.2)]',
    danger: 'bg-[#FF5368]/15 text-[#FF5368] hover:bg-[#FF5368]/25 border border-[#FF5368]/40 hover:border-[#FF5368]',
    ghost: 'bg-transparent text-[#78919F] hover:text-[#E8F5FF] hover:bg-[#0E2430]/60 border border-transparent',
  }[variant];

  const glowStyles = glow ? 'shadow-[0_0_20px_rgba(25,199,241,0.35)]' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${glowStyles} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
    </button>
  );
};
