import React from 'react';
import { useHabits } from '@/contexts/HabitsContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const DataExport = () => {
  const { habits, completions } = useHabits();

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      habits,
      completions,
    };
    const json = JSON.stringify(data, null, 2);
    const filename = `habitflow-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    downloadFile(json, filename, 'application/json');
    toast.success('Data exported as JSON');
  };

  const exportCSV = () => {
    // Create habits CSV
    const habitHeaders = ['ID', 'Name', 'Color', 'Category', 'Created At'];
    const habitRows = habits.map(h => [
      h.id,
      `"${h.name.replace(/"/g, '""')}"`,
      h.color,
      h.category || '',
      h.createdAt,
    ]);

    // Create completions CSV
    const completionRows = [];
    Object.entries(completions).forEach(([date, habitCompletions]) => {
      Object.entries(habitCompletions).forEach(([habitId, completed]) => {
        if (completed) {
          const habit = habits.find(h => h.id === habitId);
          completionRows.push([date, habitId, habit?.name || 'Unknown']);
        }
      });
    });

    const habitsCSV = [
      habitHeaders.join(','),
      ...habitRows.map(row => row.join(',')),
    ].join('\n');

    const completionsCSV = [
      'Date,Habit ID,Habit Name',
      ...completionRows.map(row => row.join(',')),
    ].join('\n');

    const fullCSV = `# Habits\n${habitsCSV}\n\n# Completions\n${completionsCSV}`;
    const filename = `habitflow-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    downloadFile(fullCSV, filename, 'text/csv');
    toast.success('Data exported as CSV');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportJSON} className="gap-2 cursor-pointer">
          <FileJson className="h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportCSV} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataExport;
