import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={clsx(
        // Используем CSS анимацию pulse. Важно задать нейтральный цвет, не бьющий по глазам
        'animate-pulse bg-gray-300/60 rounded-xl',
        className,
      )}
    />
  );
};
