/**
 * RentTech — Utility Helpers
 * Shared formatting and helper functions used across the dashboard.
 */

/**
 * Format a number as USD currency.
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format an ISO date string to a human-readable short format.
 * @param {string} dateString — e.g. '2026-06-01'
 * @returns {string} — e.g. 'Jun 1, 2026'
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a number with locale-appropriate thousand separators.
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Return Tailwind class sets for a given status string.
 * @param {string} status
 * @returns {{ bg: string, text: string, border: string, dot: string }}
 */
export const getStatusColor = (status) => {
  const colors = {
    Active:      { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    Available:   { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    Pending:     { bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500' },
    Reserved:    { bg: 'bg-violet-50',   text: 'text-violet-700',  border: 'border-violet-200',  dot: 'bg-violet-500' },
    Overdue:     { bg: 'bg-rose-50',     text: 'text-rose-700',    border: 'border-rose-200',    dot: 'bg-rose-500' },
    Completed:   { bg: 'bg-slate-100',   text: 'text-slate-600',   border: 'border-slate-200',   dot: 'bg-slate-400' },
    Rented:      { bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200',    dot: 'bg-blue-500' },
    Maintenance: { bg: 'bg-orange-50',   text: 'text-orange-700',  border: 'border-orange-200',  dot: 'bg-orange-500' },
    Inactive:    { bg: 'bg-slate-50',    text: 'text-slate-500',   border: 'border-slate-200',   dot: 'bg-slate-400' },
    Paid:        { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    'In Progress': { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    dot: 'bg-blue-500' },
    'In Service':  { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',    dot: 'bg-blue-500' },
    Cancelled:   { bg: 'bg-rose-50',     text: 'text-rose-700',    border: 'border-rose-200',    dot: 'bg-rose-500' },
    'Low Stock': { bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200',   dot: 'bg-amber-500' },
    'Out of Stock': { bg: 'bg-rose-50',  text: 'text-rose-700',    border: 'border-rose-200',    dot: 'bg-rose-500' },
  };
  return colors[status] || colors.Active;
};

/**
 * Calculate the number of days between two date strings.
 * @param {string} start
 * @param {string} end
 * @returns {number}
 */
export const calculateDaysBetween = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.ceil(Math.abs(e - s) / (1000 * 60 * 60 * 24));
};

/**
 * Extract up to 2 initials from a full name.
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Clamp a number between min and max.
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Utility to export an array of objects to a CSV file and trigger download
 * 
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Desired filename without extension
 */
export const exportToCSV = (data, filename) => {
  if (!data || !data.length) return;

  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Convert objects to CSV string
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header] === null || row[header] === undefined ? '' : row[header];
        // Handle strings that contain commas, quotes or newlines
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    )
  ].join('\n');

  // Create Blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, `${filename}.csv`);
  } else {
    // Other browsers
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
