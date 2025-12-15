import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const StatsCardSkeleton = () => {
  return (
    <Card className="border border-border bg-card">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatsGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatsCardSkeleton />
      <StatsCardSkeleton />
      <StatsCardSkeleton />
    </div>
  );
};

export default StatsCardSkeleton;
