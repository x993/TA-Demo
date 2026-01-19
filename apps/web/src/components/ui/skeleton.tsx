import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border p-4", className)}>
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

function ListSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>
  );
}

function BriefSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Headline skeleton */}
      <div className="rounded-xl border border-border p-6 glass">
        <Skeleton className="h-3 w-16 mb-3" />
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2" />
      </div>

      {/* Status counts skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-8 w-12 mb-1" />
            <Skeleton className="h-2 w-20" />
          </div>
        ))}
      </div>

      {/* Events skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 mb-2" />
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export { Skeleton, CardSkeleton, ListSkeleton, BriefSkeleton };
