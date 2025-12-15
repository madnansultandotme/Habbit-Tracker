import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import api from '@/lib/api';

const HabitsContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
};

const STORAGE_KEY = 'habit-tracker-data';

export const HabitsProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check backend connectivity and load data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to connect to backend
      await api.healthCheck();
      setIsOnline(true);

      // Load from backend
      const backendHabits = await api.getHabits();
      
      // Transform backend data to frontend format
      const transformedHabits = backendHabits.map(h => ({
        id: h.id,
        name: h.name,
        color: h.color,
        createdAt: h.created_at,
      }));
      
      // Load completions for each habit
      const completionsMap = {};
      for (const habit of transformedHabits) {
        const habitCompletions = await api.getCompletions(habit.id);
        habitCompletions.forEach(c => {
          if (c.completed) {
            if (!completionsMap[c.date]) completionsMap[c.date] = {};
            completionsMap[c.date][c.habit_id] = true;
          }
        });
      }

      setHabits(transformedHabits);
      setCompletions(completionsMap);
      
      // Also save to localStorage as backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        habits: transformedHabits, 
        completions: completionsMap 
      }));
    } catch (error) {
      console.warn('Backend unavailable, using localStorage:', error.message);
      setIsOnline(false);
      
      // Fallback to localStorage
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const { habits: savedHabits, completions: savedCompletions } = JSON.parse(savedData);
          setHabits(savedHabits || []);
          setCompletions(savedCompletions || {});
        } catch (e) {
          console.error('Error loading localStorage data:', e);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save to localStorage when data changes (offline backup)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, completions }));
    }
  }, [habits, completions, isLoading]);

  const addHabit = async (habitName, color = 'primary') => {
    const newHabit = {
      id: Date.now().toString(),
      name: habitName,
      color,
      createdAt: new Date().toISOString(),
    };

    if (isOnline) {
      try {
        const created = await api.createHabit({ name: habitName, color });
        const transformedHabit = {
          id: created.id,
          name: created.name,
          color: created.color,
          createdAt: created.created_at,
        };
        setHabits(prev => [...prev, transformedHabit]);
        return transformedHabit;
      } catch (error) {
        console.error('Failed to create habit on backend:', error);
        // Fallback to local
        setHabits(prev => [...prev, newHabit]);
        return newHabit;
      }
    } else {
      setHabits(prev => [...prev, newHabit]);
      return newHabit;
    }
  };

  const deleteHabit = async (habitId) => {
    if (isOnline) {
      try {
        await api.deleteHabit(habitId);
      } catch (error) {
        console.error('Failed to delete habit on backend:', error);
      }
    }

    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCompletions(prev => {
      const newCompletions = { ...prev };
      Object.keys(newCompletions).forEach(date => {
        delete newCompletions[date]?.[habitId];
      });
      return newCompletions;
    });
  };

  const toggleCompletion = async (habitId, date) => {
    const dateKey = format(date, 'yyyy-MM-dd');

    if (isOnline) {
      try {
        await api.toggleCompletion(habitId, dateKey);
      } catch (error) {
        console.error('Failed to toggle completion on backend:', error);
      }
    }

    setCompletions(prev => {
      const newCompletions = { ...prev };
      if (!newCompletions[dateKey]) {
        newCompletions[dateKey] = {};
      }
      newCompletions[dateKey][habitId] = !newCompletions[dateKey][habitId];
      return newCompletions;
    });
  };

  const isHabitCompleted = (habitId, date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return completions[dateKey]?.[habitId] || false;
  };

  const getStreak = (habitId) => {
    let streak = 0;
    let currentDay = new Date();
    
    // Check if today is completed, if not, start from yesterday
    const todayKey = format(currentDay, 'yyyy-MM-dd');
    if (!completions[todayKey]?.[habitId]) {
      currentDay.setDate(currentDay.getDate() - 1);
    }
    
    while (true) {
      const dateKey = format(currentDay, 'yyyy-MM-dd');
      if (completions[dateKey]?.[habitId]) {
        streak++;
        currentDay.setDate(currentDay.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getCompletionRate = (habitId, days = 30) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const daysArray = eachDayOfInterval({ start: startDate, end: endDate });
    const completed = daysArray.filter(date => isHabitCompleted(habitId, date)).length;
    
    return Math.round((completed / daysArray.length) * 100);
  };

  const getTodayCompletions = () => {
    return habits.filter(habit => isHabitCompleted(habit.id, new Date())).length;
  };

  const getMonthlyCompletions = (date = new Date()) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => ({
      date: day,
      completions: habits.filter(habit => isHabitCompleted(habit.id, day)).length,
      total: habits.length,
    }));
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        completions,
        currentDate,
        setCurrentDate,
        addHabit,
        deleteHabit,
        toggleCompletion,
        isHabitCompleted,
        getStreak,
        getCompletionRate,
        getTodayCompletions,
        getMonthlyCompletions,
        isOnline,
        isLoading,
        refresh: loadData,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};
