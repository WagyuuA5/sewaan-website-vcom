import React from 'react';
import { motion } from 'framer-motion';

export default function TechBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-slate-900">
      {/* Base Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(to right, #4f4f4f 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Deep Space Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[150px]" 
      />

      {/* Cyber Circuit Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d="M-100,200 Q150,200 200,300 T500,400 T800,200"
          fill="none"
          stroke="url(#lineGrad1)"
          strokeWidth="2"
          filter="url(#glow)"
          initial={{ strokeDasharray: "1000 1000", strokeDashoffset: 1000 }}
          animate={{ strokeDashoffset: -1000 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M-100,500 Q200,500 300,400 T600,600 T900,300"
          fill="none"
          stroke="url(#lineGrad2)"
          strokeWidth="2"
          filter="url(#glow)"
          initial={{ strokeDasharray: "1200 1200", strokeDashoffset: 1200 }}
          animate={{ strokeDashoffset: -1200 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
        />
        <motion.path
          d="M200,-100 L200,200 L400,400 L400,900"
          fill="none"
          stroke="url(#lineGrad1)"
          strokeWidth="1.5"
          filter="url(#glow)"
          initial={{ strokeDasharray: "800 800", strokeDashoffset: 800 }}
          animate={{ strokeDashoffset: -800 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
        />
      </svg>

      {/* Data Nodes */}
      <motion.div 
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[300px] left-[200px] w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
      />
      <motion.div 
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-[400px] left-[500px] w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_15px_#3b82f6]"
      />

      {/* Bottom Rotating System Loader */}
      <div className="absolute bottom-[15%] right-[20%] flex flex-col items-center justify-center opacity-80">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 blur-[5px]"
          />
        </div>
        <motion.div 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mt-6 text-cyan-400/80 font-mono text-xs tracking-[0.3em]"
        >
          MEMUAT SISTEM...
        </motion.div>
      </div>
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40" />
    </div>
  );
}
