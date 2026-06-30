import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TypewriterEffectSmooth } from './typewriter-effect';

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '5xl': 'max-w-7xl',
};

/**
 * Centered modal dialog with backdrop blur.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title: string,
 *   children: React.ReactNode,
 *   size?: 'sm' | 'md' | 'lg' | 'xl',
 * }} props
 */
export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const modalRef = useRef(null);
  // Track whether we've already focused on the current open session
  const hasFocusedRef = useRef(false);
  // Keep a stable ref to onClose so keydown handler doesn't re-register on every render
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    if (isOpen) {
      hasFocusedRef.current = false;
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      hasFocusedRef.current = false;
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Focus the modal container ONCE when it first becomes visible,
  // but only if no child input is already focused — this prevents
  // the "one character" typing bug caused by repeated focus stealing.
  const handleModalMount = useCallback((node) => {
    modalRef.current = node;
    if (node && !hasFocusedRef.current) {
      hasFocusedRef.current = true;
      // Only steal focus if no interactive child already has it
      setTimeout(() => {
        const focused = document.activeElement;
        const isInputFocused = focused && (focused.tagName === 'INPUT' || focused.tagName === 'TEXTAREA' || focused.tagName === 'SELECT');
        if (!isInputFocused) {
          node.focus();
        }
      }, 10);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              ref={handleModalMount}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`bg-white rounded-2xl shadow-xl w-full ${sizeMap[size]} max-h-[90vh] overflow-hidden flex flex-col dark:bg-slate-900 outline-none`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                {typeof title === 'string' ? (
                  <div id="modal-title">
                    <TypewriterEffectSmooth 
                      words={title.split(' ').map((word, idx, arr) => ({
                        text: word,
                        className: idx === arr.length - 1 ? "text-blue-600" : "text-slate-900"
                      }))}
                      className="my-0 text-lg flex items-center"
                      cursorClassName="h-5"
                    />
                  </div>
                ) : (
                  <h3 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                )}
                <button
                  onClick={onClose}
                  aria-label="Tutup modal"
                  className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-600 cursor-pointer dark:hover:bg-slate-800 dark:hover:text-slate-300"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
