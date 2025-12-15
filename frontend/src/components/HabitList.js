import React from 'react';
import { useHabits } from '../contexts/HabitsContext';
import HabitCard from './HabitCard';
import EmptyState from './EmptyState';

export const HabitList = () => {
  const { habits } = useHabits();

  if (habits.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
};

export default HabitList;
