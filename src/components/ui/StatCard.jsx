import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * KPI metric card with gradient icon, value, label, and trend indicator.
 *
 * @param {{
 *   stat: { title: string, value: string, change: string, trend: 'up' | 'down', icon: React.ComponentType, color: string },
 *   index: number,
 * }} props
 */
export default function StatCard({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 card-hover dark:bg-slate-900 dark:border-slate-800"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
          <stat.icon size={22} className="text-white" />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            stat.trend === 'up'
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-rose-700 bg-rose-50'
          }`}
        >
          {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {stat.change}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1 dark:text-white">{stat.value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</div>
    </motion.div>
  );
}
