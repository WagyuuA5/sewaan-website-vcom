import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getPresetRange } from '../utils/dateRangePresets';

const defaultPreset = 'last_30_days';
const defaultRange = getPresetRange(defaultPreset);

export const useDateFilterStore = create(
  persist(
    (set) => ({
      dateRange: {
        startDate: defaultRange.startDate,
        endDate: defaultRange.endDate,
      },
      activePreset: defaultPreset,
      label: 'Last 30 days',
      
      setDateRange: (range, preset, label) => set({
        dateRange: range,
        activePreset: preset,
        label: label,
      }),
    }),
    {
      name: 'vcom-date-filter-storage',
      merge: (persistedState, currentState) => {
        if (!persistedState) return currentState;
        return {
          ...currentState,
          ...persistedState,
          dateRange: persistedState.dateRange ? {
            startDate: persistedState.dateRange.startDate ? new Date(persistedState.dateRange.startDate) : null,
            endDate: persistedState.dateRange.endDate ? new Date(persistedState.dateRange.endDate) : null,
          } : currentState.dateRange,
        };
      },
    }
  )
);
