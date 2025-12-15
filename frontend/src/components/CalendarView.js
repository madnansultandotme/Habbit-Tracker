import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

export const CalendarView = () => {
  const { habits, isHabitCompleted, getMonthlyCompletions } = useHabits();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const monthlyData = getMonthlyCompletions(currentMonth);

  const getDayCompletions = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const dayData = monthlyData.find(d => format(d.date, 'yyyy-MM-dd') === dateStr);
    return dayData ? dayData.completions : 0;
  };

  const getCompletionColor = (day) => {
    if (!isSameMonth(day, currentMonth)) return 'bg-muted/30 text-muted-foreground';
    
    const completions = getDayCompletions(day);
    const total = habits.length;
    
    if (total === 0) return 'bg-muted text-foreground';
    
    const percentage = (completions / total) * 100;
    
    if (percentage === 0) return 'bg-muted hover:bg-muted/80 text-foreground';
    if (percentage <= 25) return 'bg-primary/20 hover:bg-primary/30 text-foreground';
    if (percentage <= 50) return 'bg-primary/40 hover:bg-primary/50 text-foreground';
    if (percentage <= 75) return 'bg-primary/60 hover:bg-primary/70 text-primary-foreground';
    return 'bg-success hover:bg-success/90 text-success-foreground';
  };

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <Card className="border border-border shadow-custom-sm">
      <CardHeader className="space-y-0 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl sm:text-2xl">
            {format(currentMonth, 'MMMM yyyy')}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth} className="h-9 w-9">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        {/* Legend */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Completion:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-muted" />
            <span>0%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-primary/40" />
            <span>~50%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-success" />
            <span>100%</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((day, idx) => {
              const completions = getDayCompletions(day);
              const total = habits.length;
              
              return (
                <div
                  key={idx}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center p-1 sm:p-2 transition-colors
                    ${getCompletionColor(day)}
                    ${isToday(day) ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                  `}
                >
                  <span className={`text-xs sm:text-sm font-medium ${
                    !isSameMonth(day, currentMonth) ? 'opacity-40' : ''
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {isSameMonth(day, currentMonth) && total > 0 && (
                    <span className="text-[10px] mt-0.5 opacity-75">
                      {completions}/{total}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Summary */}
        {habits.length > 0 && (
          <div className="mt-6 p-4 rounded-lg bg-muted/50">
            <h4 className="text-sm font-medium mb-2">Monthly Summary</h4>
            <div className="space-y-2">
              {habits.map(habit => {
                const daysInMonth = monthlyData.length;
                const completedDays = monthlyData.filter(d => 
                  isHabitCompleted(habit.id, d.date)
                ).length;
                const percentage = Math.round((completedDays / daysInMonth) * 100);
                
                return (
                  <div key={habit.id} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{habit.name}</span>
                    <span className="text-muted-foreground">
                      {completedDays}/{daysInMonth} days ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarView;
