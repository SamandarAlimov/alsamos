import { Skeleton } from "./skeleton";

export const SkeletonCard = () => (
  <div className="glass-card rounded-2xl p-6 space-y-4">
    <Skeleton className="h-48 w-full rounded-xl" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-10 w-full rounded-lg" />
  </div>
);

export const SkeletonProductCard = () => (
  <div className="glass-card rounded-2xl overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export const SkeletonNewsCard = () => (
  <div className="glass-card rounded-xl p-4 space-y-3">
    <Skeleton className="h-3 w-20" />
    <Skeleton className="h-5 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-24" />
  </div>
);

export const SkeletonJobCard = () => (
  <div className="glass-card rounded-2xl p-6 space-y-4">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-3/4" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
    <Skeleton className="h-4 w-full" />
    <div className="flex gap-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const SkeletonHero = () => (
  <div className="py-16 lg:py-24">
    <div className="container mx-auto px-4 space-y-8">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-12 w-3/4 max-w-xl" />
      <Skeleton className="h-6 w-full max-w-2xl" />
      <Skeleton className="h-6 w-2/3 max-w-xl" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-36" />
        <Skeleton className="h-12 w-36" />
      </div>
    </div>
  </div>
);

export const SkeletonStat = () => (
  <div className="glass-card p-6 rounded-2xl text-center space-y-2">
    <Skeleton className="h-10 w-24 mx-auto" />
    <Skeleton className="h-4 w-20 mx-auto" />
  </div>
);

export const SkeletonGrid = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
