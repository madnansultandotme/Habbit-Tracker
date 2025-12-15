import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trash2, Flame, TrendingUp } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export const HabitCard = ({ habit }) => {
  const { toggleCompletion, isHabitCompleted, getStreak, getCompletionRate, deleteHabit } = useHabits();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const today = new Date();
  const isCompleted = isHabitCompleted(habit.id, today);
  const streak = getStreak(habit.id);
  const completionRate = getCompletionRate(habit.id, 30);

  const handleToggle = () => {
    toggleCompletion(habit.id, today);
    if (!isCompleted) {
      toast.success('Great job! Keep it up! 🎉');
    }
  };

  const handleDelete = () => {
    deleteHabit(habit.id);
    setShowDeleteDialog(false);
    toast.success('Habit deleted successfully');
  };

  return (
    <>
      <Card className="card-hover border border-border bg-card shadow-custom-sm hover:shadow-custom-md">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Checkbox */}
            <div className="flex-shrink-0 pt-1">
              <Checkbox
                checked={isCompleted}
                onCheckedChange={handleToggle}
                className="habit-checkbox w-6 h-6 rounded-md border-2 data-[state=checked]:bg-success data-[state=checked]:border-success"
              />
            </div>

            {/* Habit Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className={`text-base sm:text-lg font-medium ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {habit.name}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {streak > 0 && (
                  <Badge variant="secondary" className="bg-habit-streak text-accent-foreground border-0">
                    <Flame className="w-3 h-3 mr-1" />
                    {streak} day{streak !== 1 ? 's' : ''} streak
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-muted text-muted-foreground border-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {completionRate}% (30d)
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <Progress value={completionRate} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Completion rate over last 30 days
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{habit.name}"? This action cannot be undone and will remove all progress data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HabitCard;
