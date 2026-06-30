import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  subYears
} from 'date-fns';

export const presets = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last_7_days', label: 'Last 7 days' },
  { id: 'last_30_days', label: 'Last 30 days' },
  { id: 'month_to_date', label: 'Month to date' },
  { id: 'last_month', label: 'Last month' },
  { id: 'year_to_date', label: 'Year to date' },
  { id: 'all_time', label: 'All time' }
];

export function getPresetRange(presetId) {
  const now = new Date();
  
  switch (presetId) {
    case 'today':
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
      };
    case 'yesterday':
      return {
        startDate: startOfDay(subDays(now, 1)),
        endDate: endOfDay(subDays(now, 1)),
      };
    case 'last_7_days':
      return {
        startDate: startOfDay(subDays(now, 6)), // 6 days ago + today = 7 days
        endDate: endOfDay(now),
      };
    case 'last_30_days':
      return {
        startDate: startOfDay(subDays(now, 29)),
        endDate: endOfDay(now),
      };
    case 'month_to_date':
      return {
        startDate: startOfMonth(now),
        endDate: endOfDay(now),
      };
    case 'last_month': {
      const lastMonthDate = startOfMonth(subDays(startOfMonth(now), 1));
      return {
        startDate: lastMonthDate,
        endDate: endOfMonth(lastMonthDate),
      };
    }
    case 'year_to_date':
      return {
        startDate: startOfYear(now),
        endDate: endOfDay(now),
      };
    case 'all_time':
      return {
        startDate: startOfYear(subYears(now, 5)), // e.g. 5 years ago as start
        endDate: endOfDay(now),
      };
    default:
      return null; // custom or invalid
  }
}
