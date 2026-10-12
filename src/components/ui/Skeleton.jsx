import React from 'react';

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`skeleton-shimmer rounded-lg ${className}`}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="w-48 h-5" />
            <Skeleton className="w-32 h-3.5" />
          </div>
        </div>
        <Skeleton className="w-24 h-8 rounded-lg" />
      </div>
      <Skeleton className="w-full h-20 rounded-xl" />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-12 rounded-lg" />
      </div>
    </div>
  );
}
