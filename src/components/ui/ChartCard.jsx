import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './Toast';

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

/**
 * Card wrapper for chart sections with title, subtitle, and interactive action.
 */
export default function ChartCard({ title, subtitle, action, onDetail, onDownload, children, className = '' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { showToast } = useToast();

  useOnClickOutside(menuRef, () => setIsMenuOpen(false));

  const handleAction = (act) => {
    setIsMenuOpen(false);
    if (act === 'detail') {
      if (onDetail) onDetail();
      else showToast(`Menampilkan detail untuk ${title}`, 'info');
    }
    if (act === 'download') {
      if (onDownload) {
        // Wait for menu to close before capturing
        setTimeout(() => onDownload(), 150);
      } else {
        showToast(`Mengunduh data ${title}...`, 'success');
      }
    }
    if (act === 'print') {
      showToast(`Mempersiapkan dokumen cetak...`, 'info');
      setTimeout(() => window.print(), 1000);
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 ${className} dark:bg-slate-900 dark:border-slate-800`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-900 text-base dark:text-white">{title}</h3>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5 dark:text-slate-400">{subtitle}</p>}
        </div>
        {action || (
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition cursor-pointer ${isMenuOpen ? 'bg-slate-100 text-blue-600' : 'hover:bg-slate-100 text-slate-400'} dark:'hover:bg-slate-800`}
            >
              <MoreHorizontal size={18} />
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-20 origin-top-right dark:bg-slate-900 dark:border-slate-800"
                >
                  <div className="p-1.5 space-y-0.5">
                    <button onClick={() => handleAction('detail')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition cursor-pointer dark:text-slate-200 dark:hover:bg-slate-950">
                      <Eye size={16} /> Lihat Detail
                    </button>
                    <button onClick={() => handleAction('download')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition cursor-pointer dark:text-slate-200 dark:hover:bg-slate-950">
                      <Download size={16} /> Unduh Data
                    </button>
                    <div className="h-px bg-slate-100 my-1 dark:bg-slate-800" />
                    <button onClick={() => handleAction('print')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition cursor-pointer dark:text-slate-200 dark:hover:bg-slate-950">
                      <Printer size={16} /> Cetak
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
