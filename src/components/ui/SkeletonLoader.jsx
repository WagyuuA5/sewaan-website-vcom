import React from 'react';

// Dashboard Specific Skeleton
const DashboardSkeleton = () => (
  <div className="w-full h-full p-6 animate-pulse">
    {/* PageWrapper Header */}
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <div className="w-64 h-8 bg-slate-200 dark:bg-slate-700/50 rounded-md"></div>
        <div className="w-96 h-4 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
      </div>
      <div className="w-36 h-10 bg-slate-200 dark:bg-slate-700/50 rounded-xl"></div>
    </div>

    {/* Section 1 Header */}
    <div className="w-64 h-6 bg-slate-200 dark:bg-slate-700/50 rounded mb-4"></div>

    {/* 3 Stat Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col justify-between h-[120px]">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700/50"></div>
            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
            <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
          </div>
        </div>
      ))}
    </div>

    {/* Chart & List Row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Chart Skeleton (2/3 width) */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <div className="flex justify-between mb-4">
          <div className="space-y-2">
            <div className="w-48 h-6 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
            <div className="w-64 h-4 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
          </div>
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700/50 rounded-md"></div>
        </div>
        <div className="w-full h-[250px] bg-slate-100 dark:bg-slate-700/30 rounded-xl mt-4"></div>
      </div>

      {/* Recent List Skeleton (1/3 width) */}
      <div className="bg-white dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
        <div className="flex justify-between mb-6">
          <div className="space-y-2">
            <div className="w-32 h-6 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
            <div className="w-48 h-4 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
          </div>
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700/50 rounded-md"></div>
        </div>
        <div className="space-y-5">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
                <div className="w-32 h-3 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
              </div>
              <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700/50 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Table Specific Skeleton (Inventory, Customers, etc.)
const TableSkeleton = () => (
  <div className="w-full h-full p-6 animate-pulse">
    {/* PageWrapper Header */}
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <div className="w-64 h-8 bg-slate-200 dark:bg-slate-700/50 rounded-md"></div>
        <div className="w-96 h-4 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-24 h-10 bg-slate-200 dark:bg-slate-700/50 rounded-xl"></div>
        <div className="w-36 h-10 bg-slate-200 dark:bg-slate-700/50 rounded-xl"></div>
      </div>
    </div>

    <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6">
      {/* Filter/Search Bar */}
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="w-1/3 h-10 bg-slate-200 dark:bg-slate-700/50 rounded-lg"></div>
        <div className="flex gap-2 w-1/3 justify-end">
          <div className="w-24 h-10 bg-slate-200 dark:bg-slate-700/50 rounded-lg"></div>
          <div className="w-24 h-10 bg-slate-200 dark:bg-slate-700/50 rounded-lg"></div>
        </div>
      </div>
      
      {/* Table Header */}
      <div className="h-12 bg-slate-100 dark:bg-slate-700/30 rounded-lg mb-4 flex items-center px-4 gap-4">
         <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/6"></div>
         <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/4"></div>
         <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/4"></div>
         <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/6"></div>
         <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/6"></div>
      </div>

      {/* Table Rows */}
      <div className="space-y-0">
        {[1, 2, 3, 4, 5, 6, 7].map((row) => (
          <div key={`row-${row}`} className="flex items-center gap-4 py-4 px-4 border-b border-slate-50 dark:border-slate-700/30 last:border-0">
             <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/6"></div>
             <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/4"></div>
             <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/4"></div>
             <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/6"></div>
             <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/6 text-right flex justify-end">
                <div className="w-8 h-8 rounded-md bg-slate-200 dark:bg-slate-700/50"></div>
             </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
        <div className="flex gap-2">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700/50 rounded-md"></div>
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700/50 rounded-md"></div>
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700/50 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
);

// Form/Settings Skeleton
const FormSkeleton = () => (
  <div className="w-full h-full p-6 animate-pulse">
    {/* PageWrapper Header */}
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <div className="w-64 h-8 bg-slate-200 dark:bg-slate-700/50 rounded-md"></div>
        <div className="w-96 h-4 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Form Sidebar */}
      <div className="md:col-span-1 space-y-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-12 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center px-4">
             <div className="w-6 h-6 bg-slate-200 dark:bg-slate-700/50 rounded-md mr-3"></div>
             <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="md:col-span-2 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-6">
        <div className="w-48 h-6 bg-slate-200 dark:bg-slate-700/50 rounded mb-6"></div>
        
        <div className="space-y-6">
          {[1, 2, 3].map((group) => (
            <div key={group} className="space-y-2">
              <div className="w-32 h-4 bg-slate-200 dark:bg-slate-700/50 rounded"></div>
              <div className="w-full h-12 bg-slate-100 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-700/50"></div>
            </div>
          ))}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-end">
            <div className="w-32 h-10 bg-slate-200 dark:bg-slate-700/50 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SkeletonLoader = ({ path = '/' }) => {
  // Determine which skeleton to show based on the route
  const isDashboard = path === '/';
  const isSettingsOrForm = path.includes('/settings') || path.includes('/docs') || path.includes('/faq');

  if (isDashboard) {
    return <DashboardSkeleton />;
  }

  if (isSettingsOrForm) {
    return <FormSkeleton />;
  }

  // Default to Table skeleton for inventory, customers, rentals, etc.
  return <TableSkeleton />;
};

export default SkeletonLoader;
