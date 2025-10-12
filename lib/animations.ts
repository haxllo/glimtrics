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
  animate: {
    transition: {
      staggerChildren: 0.1,
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

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.03,
    y: -4,
    transition: {
      duration: 0.3,
      ease: smoothEase,
    },
  },
};

export const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};
