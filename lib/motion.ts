export const springSmooth = {
  type: "spring",
  stiffness: 120,
  damping: 22,
  mass: 0.8
} as const;

export const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};

export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 22,
    filter: "blur(8px)"
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: springSmooth
  }
};

export const softScaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 18
  },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springSmooth
  }
};
