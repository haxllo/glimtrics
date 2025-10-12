import { Paddle } from '@paddle/paddle-node-sdk';

let paddleInstance: Paddle | null = null;

export function getPaddle(): Paddle {
  if (!paddleInstance) {
    if (!process.env.PADDLE_API_KEY) {
      throw new Error('PADDLE_API_KEY is not defined in environment variables. Add it to your .env file.');
    }
    paddleInstance = new Paddle(process.env.PADDLE_API_KEY);
  }
  return paddleInstance;
}

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '1 dataset upload',
      '5 AI insights per month',
      'Basic charts',
      'Community support',
    ],
    limits: {
      datasets: 1,
      insights: 5,
      pdfExports: 0,
    },
  },
  PRO: {
    name: 'Pro',
    price: 1499, // $14.99 in cents
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID,
    features: [
      'Unlimited datasets',
      'Unlimited AI insights',
      'All chart types',
      'PDF export',
      'Priority support',
      'Advanced analytics',
    ],
    limits: {
      datasets: 999999,
      insights: 999999,
      pdfExports: 999999,
    },
  },
  BUSINESS: {
    name: 'Business',
    price: 4999, // $49.99 in cents
    priceId: process.env.NEXT_PUBLIC_PADDLE_BUSINESS_PRICE_ID,
    features: [
      'Everything in Pro',
      'Multi-user dashboards',
      'Team collaboration',
      'API access',
      'White-label reports',
      'Dedicated support',
    ],
    limits: {
      datasets: 999999,
      insights: 999999,
      pdfExports: 999999,
    },
  },
} as const;

export function getPlanFromPriceId(priceId: string | null): 'free' | 'pro' | 'business' {
  if (priceId === PLANS.PRO.priceId) return 'pro';
  if (priceId === PLANS.BUSINESS.priceId) return 'business';
  return 'free';
}

export function getPlanLimits(plan: string) {
  switch (plan) {
    case 'pro':
      return PLANS.PRO.limits;
    case 'business':
      return PLANS.BUSINESS.limits;
    default:
      return PLANS.FREE.limits;
  }
}
