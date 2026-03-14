interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-beige rounded-[8px] ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-cream-card border border-beige rounded-[14px] p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-36 mb-1" />
      <Skeleton className="h-4 w-28 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-cream-card border border-beige rounded-[14px] p-6">
      <Skeleton className="h-8 w-12 mb-2" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}
