import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send } from 'lucide-react';

export default function AnimatedSearchInput({ value, onChange, placeholder = "Cari..." }) {
  return (
    <div className="relative flex-1">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px]">
        <AnimatePresence mode="popLayout">
          {value.length > 0 ? (
            <motion.div
              key="send"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Send size={18} className="text-blue-500" />
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 pointer-events-none"
            >
              <Search size={18} className="text-slate-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
      />
    </div>
  );
}
