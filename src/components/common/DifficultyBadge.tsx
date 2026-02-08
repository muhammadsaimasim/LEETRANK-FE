import { cn } from '@/lib/utils';

interface DifficultyBadgeProps {
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
  showLabel?: boolean;
  className?: string;
}

export function DifficultyBadge({ difficulty, count, showLabel = true, className }: DifficultyBadgeProps) {
  const colors = {
    easy: 'bg-difficulty-easy/10 text-difficulty-easy border-difficulty-easy/20',
    medium: 'bg-difficulty-medium/10 text-difficulty-medium border-difficulty-medium/20',
    hard: 'bg-difficulty-hard/10 text-difficulty-hard border-difficulty-hard/20',
  };

  const labels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium border',
        colors[difficulty],
        className
      )}
    >
      {showLabel && <span className="text-xs opacity-80">{labels[difficulty]}</span>}
      <span className="font-semibold">{count}</span>
    </span>
  );
}
