"use client";

import { motion } from "motion/react";

export function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-mesh-gradient"
        animate={{ scale: [1, 1.04, 1], rotate: [0, 1.3, -1, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-24 top-20 h-[420px] w-[420px] rounded-full bg-ocean-500/20 blur-[80px]"
        animate={{ y: [0, -24, 0], x: [0, 18, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-100px] top-[22%] h-[420px] w-[420px] rounded-full bg-seafoam-400/15 blur-[100px]"
        animate={{ y: [0, 30, 0], x: [0, -26, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-36 left-1/3 h-[460px] w-[460px] rounded-full bg-indigo-500/15 blur-[120px]"
        animate={{ x: [0, 22, 0], y: [0, -18, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="grid-layer absolute inset-0 opacity-[0.2]" />
      <div className="noise-layer absolute inset-0 opacity-[0.12]" />
      <motion.div
        className="absolute inset-x-[-10%] top-[18%] h-[2px] bg-gradient-to-r from-transparent via-ocean-300/45 to-transparent"
        animate={{ x: [0, -110] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <div className="wave-line top-[27%]" />
      <div className="wave-line top-[40%] [animation-delay:-4s] opacity-35" />
      <div className="wave-line top-[58%] [animation-delay:-10s] opacity-25" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(1,4,10,0.72)_100%)]" />
    </div>
  );
}
