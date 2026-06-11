import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Generic data table with built-in pagination.
 *
 * @param {{
 *   columns: Array<{ key: string, label: string, render?: (value: any, row: object) => React.ReactNode, className?: string }>,
 *   data: Array<object>,
 *   pageSize?: number,
 * }} props
 */
export default function DataTable({ columns, data, pageSize = 10 }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const startIdx = (page - 1) * pageSize;
  const pageData = useMemo(
    () => data.slice(startIdx, startIdx + pageSize),
    [data, startIdx, pageSize],
  );

  const goTo = (p) => setPage(Math.max(1, Math.min(p, totalPages)));

  /* Visible page numbers (max 5) */
  const pageNumbers = useMemo(() => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageData.map((row, idx) => (
              <tr key={idx} className="table-row-hover">
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-4 whitespace-nowrap ${col.className || ''}`}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}

            {pageData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-slate-400">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.length > pageSize && (
        <div className="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <span>
            Showing {startIdx + 1} to {Math.min(startIdx + pageSize, data.length)} of {data.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => goTo(n)}
                className={`min-w-[34px] h-[34px] rounded-lg text-sm font-medium transition cursor-pointer ${
                  n === page
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
