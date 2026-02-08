import { cva, type VariantProps } from 'class-variance-authority';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const rankBadgeVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-all duration-200',
  {
    variants: {
      rank: {
        gold: 'text-leetrank-gold',
        silver: 'text-leetrank-silver',
        bronze: 'text-leetrank-bronze',
        top10: 'text-primary',
        default: 'text-muted-foreground',
      },
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      rank: 'default',
      size: 'md',
    },
  }
);

interface RankBadgeProps extends VariantProps<typeof rankBadgeVariants> {
  position: number;
  showIcon?: boolean;
  className?: string;
}

export function RankBadge({ position, showIcon = true, size, className }: RankBadgeProps) {
  const getRankVariant = (pos: number) => {
    if (pos === 1) return 'gold';
    if (pos === 2) return 'silver';
    if (pos === 3) return 'bronze';
    if (pos <= 10) return 'top10';
    return 'default';
  };

  const rankVariant = getRankVariant(position);

  const getIcon = () => {
    if (!showIcon) return null;
    const iconSize = size === 'lg' ? 20 : size === 'sm' ? 14 : 16;
    
    if (position === 1) return <Trophy size={iconSize} className="mr-1" />;
    if (position === 2) return <Medal size={iconSize} className="mr-1" />;
    if (position === 3) return <Award size={iconSize} className="mr-1" />;
    return null;
  };

  return (
    <span className={cn(rankBadgeVariants({ rank: rankVariant, size }), className)}>
      {getIcon()}
      #{position}
    </span>
  );
}
