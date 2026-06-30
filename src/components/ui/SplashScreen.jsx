import { motion } from 'framer-motion';

import { GooeyText } from './gooey-text-morphing';
import { FallingPattern } from './falling-pattern';

export default function SplashScreen() {
  
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900 overflow-hidden dark:bg-slate-50">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <FallingPattern 
          color="rgba(59, 130, 246, 0.4)" 
          backgroundColor="#0f172a" 
          density={1.5}
        />
      </div>

      {/* Dynamic Background glow effects */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] z-0 pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-600/20 rounded-full blur-[80px] z-0 pointer-events-none" 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center w-full max-w-xs"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-12"
        >
          <GooeyText 
            texts={["V-com", "Website"]}
            morphTime={0.8}
            cooldownTime={1.0}
            className="w-[240px] h-[70px]"
            textClassName="text-[2.5rem] font-bold text-white tracking-widest"
          />
        </motion.div>

        <div className="w-full flex flex-col items-center gap-4">
          <p className="text-blue-200 text-sm font-semibold tracking-[0.2em] uppercase">
            Memuat Sistem
          </p>
          
          {/* Progress Bar Container */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden dark:bg-slate-100">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 rounded-full relative"
            >
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white/30 w-1/2 skew-x-[-20deg]"
              />
            </motion.div>
          </div>
          
          <div className="flex justify-between w-full px-1">
            <span className="text-[10px] text-slate-500 font-medium dark:text-slate-400">Inisialisasi...</span>
            <span className="text-[10px] text-blue-400 font-medium animate-pulse">Mohon Tunggu</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
