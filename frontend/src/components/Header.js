import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Target } from 'lucide-react';
import ConnectionStatus from './ConnectionStatus';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground">HabitFlow</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Build better habits, one day at a time</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ConnectionStatus />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-lg hover:bg-muted"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
