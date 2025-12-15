import React, { useState } from 'react';
import Header from '../components/Header';
import HabitList from '../components/HabitList';
import AddHabitDialog from '../components/AddHabitDialog';
import CalendarView from '../components/CalendarView';
import StatsCard from '../components/StatsCard';
import { StatsGridSkeleton } from '../components/StatsCardSkeleton';
import { HabitListSkeleton } from '../components/HabitCardSkeleton';
import { useHabits } from '../contexts/HabitsContext';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, ListTodo } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { habits, getTodayCompletions, isLoading } = useHabits();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Stats Overview */}
        {isLoading ? (
          <StatsGridSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              title="Total Habits"
              value={habits.length}
              icon={<ListTodo className="w-5 h-5" />}
              color="primary"
            />
            <StatsCard
              title="Today's Progress"
              value={`${getTodayCompletions()} / ${habits.length}`}
              icon={<Calendar className="w-5 h-5" />}
              color="success"
            />
            <StatsCard
              title="Completion Rate"
              value={habits.length > 0 ? `${Math.round((getTodayCompletions() / habits.length) * 100)}%` : '0%'}
              icon={<ListTodo className="w-5 h-5" />}
              color="accent"
            />
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="habits" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="grid w-full sm:w-auto grid-cols-2">
              <TabsTrigger value="habits" className="flex items-center gap-2">
                <ListTodo className="w-4 h-4" />
                <span className="hidden sm:inline">Habits</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
            </TabsList>
            
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </div>

          <TabsContent value="habits" className="mt-0">
            {isLoading ? <HabitListSkeleton count={3} /> : <HabitList />}
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <CalendarView />
          </TabsContent>
        </Tabs>
      </main>

      <AddHabitDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
};

export default Dashboard;
