import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-border/80 bg-surface/90 p-6 shadow-soft backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  );
}
