import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Page wrapper with title, subtitle, optional action buttons, and a
 * fade-in / slide-up entrance animation.
 *
 * @param {{
 *   title: string,
 *   subtitle?: string,
 *   actions?: React.ReactNode,
 *   showBackButton?: boolean,
 *   children: React.ReactNode,
 * }} props
 */
export default function PageWrapper({ title, subtitle, actions, showBackButton = false, children }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="p-4 sm:p-6 space-y-6"
    >
      {/* Page header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>

      {children}
    </motion.div>
  );
}
