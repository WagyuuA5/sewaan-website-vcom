import { motion } from 'framer-motion';

/**
 * Page wrapper with title, subtitle, optional action buttons, and a
 * fade-in / slide-up entrance animation.
 *
 * @param {{
 *   title: string,
 *   subtitle?: string,
 *   actions?: React.ReactNode,
 *   children: React.ReactNode,
 * }} props
 */
export default function PageWrapper({ title, subtitle, actions, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="p-4 sm:p-6 space-y-6"
    >
      {/* Page header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>

      {children}
    </motion.div>
  );
}
