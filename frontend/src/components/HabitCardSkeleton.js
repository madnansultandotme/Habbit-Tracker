import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const HabitCardSkeleton = () => {
  return (
    <Card className="border border-border bg-card">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-6 w-6 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-2 w-full rounded" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const HabitListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <HabitCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default HabitCardSkeleton;
