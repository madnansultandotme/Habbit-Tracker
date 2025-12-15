import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const StatsCard = ({ title, value, icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success-light text-success-foreground',
    accent: 'bg-accent text-accent-foreground',
  };

  return (
    <Card className="border border-border shadow-custom-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className="text-2xl sm:text-3xl font-semibold text-foreground">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
