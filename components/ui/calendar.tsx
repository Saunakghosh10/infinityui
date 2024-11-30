'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  isSameDay, 
  isDateInRange, 
  startOfWeek,
  startOfMonth,
  endOfMonth 
} from '@/lib/date-utils';

interface CalendarProps {
  mode?: 'single' | 'range';
  selected?: Date | Date[] | null;
  onSelect?: (date: Date) => void;
  onRangeSelect?: (dates: [Date, Date]) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  highlightToday?: boolean;
  className?: string;
}

export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  onRangeSelect,
  minDate,
  maxDate,
  disabled = false,
  highlightToday = true,
  className,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [focusedDate, setFocusedDate] = React.useState<Date | null>(null);
  const [rangeStart, setRangeStart] = React.useState<Date | null>(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const startDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const isDateSelected = (date: Date) => {
    if (!selected) return false;
    if (Array.isArray(selected)) {
      return selected.some(selectedDate => isSameDay(date, selectedDate));
    }
    return isSameDay(date, selected);
  };

  const isDateInRange = (date: Date) => {
    if (!rangeStart || !focusedDate) return false;
    const start = rangeStart < focusedDate ? rangeStart : focusedDate;
    const end = rangeStart < focusedDate ? focusedDate : rangeStart;
    return date >= start && date <= end;
  };

  const handleDateSelect = (date: Date) => {
    if (disabled) return;
    if (mode === 'single' && onSelect) {
      onSelect(date);
    } else if (mode === 'range' && onRangeSelect) {
      if (!rangeStart) {
        setRangeStart(date);
      } else {
        const range: [Date, Date] = rangeStart < date 
          ? [rangeStart, date]
          : [date, rangeStart];
        onRangeSelect(range);
        setRangeStart(null);
      }
    }
  };

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1);
      const isSelected = isDateSelected(date);
      const isToday = highlightToday && isSameDay(date, new Date());
      const isInRange = mode === 'range' && isDateInRange(date);
      const isDisabled = disabled || (minDate && date < minDate) || (maxDate && date > maxDate);
      const isFocused = focusedDate && isSameDay(date, focusedDate);

      days.push(
        <Button
          key={i}
          variant="ghost"
          size="sm"
          className={cn(
            'h-9 w-9',
            isSelected && 'bg-zinc-800 text-zinc-100',
            isToday && 'border border-zinc-700',
            isInRange && 'bg-zinc-800/50',
            isDisabled && 'opacity-50 cursor-not-allowed',
            isFocused && 'ring-2 ring-zinc-700'
          )}
          disabled={isDisabled}
          onClick={() => handleDateSelect(date)}
          onMouseEnter={() => setFocusedDate(date)}
          onMouseLeave={() => setFocusedDate(null)}
        >
          {i + 1}
        </Button>
      );
    }
    return days;
  };

  return (
    <div className={cn('p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium">
          {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm text-zinc-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(startDay).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {renderDays()}
      </div>
    </div>
  );
}
