import React, { useState } from 'react';
import { useHabits } from '../contexts/HabitsContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const AddHabitDialog = ({ open, onOpenChange }) => {
  const { addHabit } = useHabits();
  const [habitName, setHabitName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!habitName.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    addHabit(habitName.trim());
    toast.success('Habit added successfully! 🎯');
    setHabitName('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Habit</DialogTitle>
            <DialogDescription>
              Start building a new positive habit today. Give it a clear, specific name.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="space-y-2">
              <Label htmlFor="habit-name" className="text-sm font-medium">
                Habit Name
              </Label>
              <Input
                id="habit-name"
                placeholder="e.g., Morning meditation, Read for 30 minutes"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="w-full"
                autoFocus
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Create Habit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
