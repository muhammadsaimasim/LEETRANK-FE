import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  variant?: 'easy' | 'medium' | 'hard' | 'primary';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  value,
  max,
  variant = 'primary',
  showLabel = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  const colors = {
    easy: 'bg-difficulty-easy',
    medium: 'bg-difficulty-medium',
    hard: 'bg-difficulty-hard',
    primary: 'bg-primary',
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{value}</span>
          <span className="text-muted-foreground opacity-60">/ {max}</span>
        </div>
      )}
      <div className={cn('w-full bg-muted rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
