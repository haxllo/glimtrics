import { Variants } from 'framer-motion';

// Smooth easing - Vercel/Insightify style
const smoothEase = [0.25, 0.1, 0.25, 1] as const;

// SNAPPY FADE IN - Short duration for responsiveness
export const fadeIn: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: smoothEase,
    }
  },
  exit: { opacity: 0, y: -12 },
};

// SNAPPY FADE UP - Reduced from 60px to 30px, faster
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: smoothEase,
    }
  },
};

// MINIMAL STAGGER - Subtle, fast
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0,
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

// FEATURE CARD - Snappy entrance + smooth hover
export const featureCard: Variants = {
  initial: { 
    opacity: 0, 
    y: 16,
    scale: 0.98,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: smoothEase,
    }
  },
  whileHover: { 
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: smoothEase,
    },
  },
};

// SECTION CONTAINER - For scroll-triggered sections
export const sectionContainer: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: smoothEase,
    }
  },
};

// USE CASE CARD - Minimal, fast
export const useCaseCard: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: smoothEase,
    }
  },
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};
