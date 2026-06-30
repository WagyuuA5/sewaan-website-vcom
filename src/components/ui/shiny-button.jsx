import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const animationProps = {
  initial: { "--x": "100%", scale: 1 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
};

export const ShinyButton = ({
  children,
  className,
  ...props
}) => {
  return (
    <motion.button
      {...animationProps}
      {...props}
      className={cn(
        "relative rounded-xl font-medium backdrop-blur-xl transition-shadow duration-300 ease-in-out hover:shadow-lg focus:outline-none flex items-center justify-center overflow-hidden",
        className
      )}
    >
      <span
        className="relative block size-full z-10 flex items-center justify-center gap-2"
        style={{
          maskImage:
            "linear-gradient(-75deg,rgba(0,0,0,1) calc(var(--x) + 20%),rgba(0,0,0,0.6) calc(var(--x) + 30%),rgba(0,0,0,1) calc(var(--x) + 100%))",
          WebkitMaskImage:
            "linear-gradient(-75deg,rgba(0,0,0,1) calc(var(--x) + 20%),rgba(0,0,0,0.6) calc(var(--x) + 30%),rgba(0,0,0,1) calc(var(--x) + 100%))",
        }}
      >
        {children}
      </span>
      <span
        style={{
          mask: "linear-gradient(rgb(0,0,0), rgb(0,0,0)) content-box,linear-gradient(rgb(0,0,0), rgb(0,0,0))",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
        className="absolute inset-0 z-0 block rounded-[inherit] bg-[linear-gradient(-75deg,transparent_calc(var(--x)+20%),rgba(255,255,255,0.7)_calc(var(--x)+25%),transparent_calc(var(--x)+100%))] p-[1px]"
      ></span>
      <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: "linear-gradient(-75deg,transparent calc(var(--x) + 20%),rgba(255,255,255,0.2) calc(var(--x) + 25%),transparent calc(var(--x) + 100%))",
          }}
      />
    </motion.button>
  );
};
