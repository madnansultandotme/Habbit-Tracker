import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';

export const EmptyState = () => {
  return (
    <Card className="border-2 border-dashed border-border bg-muted/30">
      <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">No habits yet</h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Start your journey by creating your first habit. Click the "Add Habit" button above to get started.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
