import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

const variants = {
  primary:
    'border border-forest-600/80 bg-forest-600 text-white shadow-glow hover:border-forest-500 hover:bg-forest-500 active:bg-forest-700',
  secondary:
    'border border-border bg-surface/80 text-foreground hover:border-forest-300 hover:bg-surface-elevated',
  ghost:
    'border border-transparent bg-transparent text-foreground hover:border-border hover:bg-white/5',
  danger:
    'border border-berry-700/70 bg-berry-700 text-white hover:bg-berry-600 hover:border-berry-600',
} as const;

const sizes = {
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-sm',
  sm: 'h-9 px-3.5 text-sm',
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
}

export function Button({
  className,
  children,
  variant = 'primary',
  size = 'md',
  leadingIcon,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[0.01em] transition-all duration-200 ease-expressive',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-current disabled:hover:bg-current/5',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {leadingIcon ? <span className="text-base">{leadingIcon}</span> : null}
      <span>{children}</span>
    </button>
  );
}
