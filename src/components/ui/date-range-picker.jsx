import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, isWithinInterval, isBefore, isAfter 
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { presets, getPresetRange } from '../../utils/dateRangePresets';
import { useDateFilterStore } from '../../store/useDateFilterStore';

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export function DateRangePicker() {
  const { dateRange, activePreset, label, setDateRange } = useDateFilterStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  useOnClickOutside(popoverRef, () => setIsOpen(false));

  // Local state for the popover (so changes are not applied until "Apply" is clicked)
  const [localRange, setLocalRange] = useState({ ...dateRange });
  const [localPreset, setLocalPreset] = useState(activePreset);
  // View month is the left calendar month. Right calendar is viewMonth + 1.
  const [viewMonth, setViewMonth] = useState(startOfMonth(dateRange.startDate || new Date()));
  const [hoverDate, setHoverDate] = useState(null);

  // When popover opens, sync local state with store
  useEffect(() => {
    if (isOpen) {
      setLocalRange({ ...dateRange });
      setLocalPreset(activePreset);
      setViewMonth(startOfMonth(dateRange.startDate || new Date()));
      setHoverDate(null);
    }
  }, [isOpen, dateRange, activePreset]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleApply = () => {
    let finalLabel = 'Custom Range';
    if (localPreset && localPreset !== 'custom') {
      const preset = presets.find(p => p.id === localPreset);
      if (preset) finalLabel = preset.label;
    } else if (localRange.startDate && localRange.endDate) {
      finalLabel = `${format(localRange.startDate, 'MMM d, yyyy')} - ${format(localRange.endDate, 'MMM d, yyyy')}`;
    }
    
    setDateRange(localRange, localPreset, finalLabel);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handlePresetClick = (presetId) => {
    const range = getPresetRange(presetId);
    if (range) {
      setLocalRange(range);
      setLocalPreset(presetId);
      setViewMonth(startOfMonth(range.startDate));
    }
  };

  const handleDateClick = (date) => {
    if (!localRange.startDate || (localRange.startDate && localRange.endDate)) {
      // Start new selection
      setLocalRange({ startDate: date, endDate: null });
      setLocalPreset('custom');
    } else if (!localRange.endDate) {
      // Complete selection
      if (isBefore(date, localRange.startDate)) {
        // Swap or restart if clicked before start date
        setLocalRange({ startDate: date, endDate: null });
      } else {
        setLocalRange({ startDate: localRange.startDate, endDate: date });
      }
    }
  };

  const nextMonth = () => setViewMonth(addMonths(viewMonth, 1));
  const prevMonth = () => setViewMonth(subMonths(viewMonth, 1));

  const renderCalendar = (month) => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 }); // Monday start
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
      <div className="flex-1 w-full sm:w-64">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition dark:hover:bg-slate-800 cursor-pointer">
            <ChevronLeft size={16} />
          </button>
          
          <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">
            {format(month, 'MMM, yyyy')}
          </div>

          <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition dark:hover:bg-slate-800 cursor-pointer">
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
          {weekDays.map((d, i) => <div key={i}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-y-1 gap-x-0.5">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, month);
            const isStart = localRange.startDate && isSameDay(day, localRange.startDate);
            const isEnd = localRange.endDate && isSameDay(day, localRange.endDate);
            const isSelected = localRange.startDate && localRange.endDate && isWithinInterval(day, { start: localRange.startDate, end: localRange.endDate });
            const isHovered = localRange.startDate && !localRange.endDate && hoverDate && (
              isBefore(localRange.startDate, hoverDate) ? 
              isWithinInterval(day, { start: localRange.startDate, end: hoverDate }) : false
            );
            
            const isBetween = (isSelected && !isStart && !isEnd) || (isHovered && !isStart && !isSameDay(day, hoverDate));

            return (
              <button
                key={idx}
                onClick={() => handleDateClick(day)}
                onMouseEnter={() => setHoverDate(day)}
                className={`
                  h-9 w-full text-sm flex items-center justify-center transition-all relative cursor-pointer
                  ${!isCurrentMonth ? 'text-slate-300 dark:text-slate-600 font-light' : 'text-slate-700 dark:text-slate-200 font-medium'}
                  ${(isStart || isEnd) ? 'bg-blue-600 text-white rounded-xl shadow-md z-10 font-bold' : ''}
                  ${isBetween ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' : ''}
                  ${!isStart && !isEnd && !isBetween ? 'hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl' : ''}
                  ${isStart && localRange.endDate ? 'rounded-r-none' : ''}
                  ${isEnd && localRange.startDate ? 'rounded-l-none' : ''}
                `}
              >
                {format(day, 'd')}
                {isSameDay(day, new Date()) && !isStart && !isEnd && (
                  <div className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={label}
        className={`flex items-center justify-center p-2.5 rounded-xl transition cursor-pointer border shadow-sm ${isOpen ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-slate-800 dark:border-blue-800/50 dark:text-blue-400' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'}`}
      >
        <CalendarIcon size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm dark:bg-slate-900/40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col sm:flex-row dark:bg-slate-900 dark:border-slate-800 w-[95vw] sm:w-auto max-h-[95vh] overflow-y-auto sm:overflow-visible"
            >
            {/* Left Sidebar - Presets */}
            <div className="w-full sm:w-48 p-3 flex flex-row sm:flex-col overflow-x-auto sm:overflow-x-hidden gap-1 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset.id)}
                  className={`flex-shrink-0 sm:flex-shrink text-left px-4 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${localPreset === preset.id ? 'bg-blue-50 text-blue-700 font-semibold dark:bg-blue-900/40 dark:text-blue-300' : 'text-slate-600 hover:bg-slate-50 font-medium dark:text-slate-300 dark:hover:bg-slate-800'}`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Right Area - Calendars */}
            <div className="p-4 sm:p-6 flex flex-col">
              <div className="flex justify-center">
                {renderCalendar(viewMonth)}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between dark:border-slate-800">
                <div className="text-sm text-slate-500 font-medium hidden sm:block dark:text-slate-400">
                  {localRange.startDate && localRange.endDate ? 
                    `Range: ${format(localRange.startDate, 'MMM d, yyyy')} - ${format(localRange.endDate, 'MMM d, yyyy')}` : 
                    'Select a range'
                  }
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={!localRange.startDate || !localRange.endDate}
                    className="flex-1 sm:flex-none px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-500/20 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
