import { Variants } from 'framer-motion';

// Smooth easing curves (like Insightify)
const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export const fadeIn: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    }
  },
  exit: { opacity: 0, y: -20 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: smoothEase,
    }
  },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};

// Optimized card hover with hardware acceleration
export const cardHover: Variants = {
  initial: { 
    scale: 1, 
    y: 0,
    borderColor: "rgba(31, 41, 55, 1)", // gray-800
  },
  whileHover: { 
    scale: 1.03,
    y: -4,
    borderColor: "rgba(16, 185, 129, 0.5)", // green-500/50
    transition: {
      duration: 0.3,
      ease: smoothEase,
    },
  },
};

// Feature card animation (combines fade in + hover) - GPU optimized
export const featureCard: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 1,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    }
  },
  whileHover: { 
    scale: 1.03,
    y: -6,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  },
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};
