import React from 'react';
import { useHabits } from '@/contexts/HabitsContext';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const ConnectionStatus = () => {
  const { isOnline, isLoading } = useHabits();

  if (isLoading) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="hidden sm:inline">Syncing</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connecting to server...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (isOnline) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="gap-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Wifi className="h-3 w-3" />
              <span className="hidden sm:inline">Online</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Connected to server - data synced</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className="gap-1.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
            <WifiOff className="h-3 w-3" />
            <span className="hidden sm:inline">Offline</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Working offline - data saved locally</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConnectionStatus;
