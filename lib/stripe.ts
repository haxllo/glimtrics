import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables. Add it to your .env file.');
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export a lazy-initialized instance
export const stripe = {
  get subscriptions() { return getStripe().subscriptions; },
  get customers() { return getStripe().customers; },
  get checkout() { return getStripe().checkout; },
  get webhooks() { return getStripe().webhooks; },
};

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
    priceId: process.env.STRIPE_PRO_PRICE_ID,
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
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
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
