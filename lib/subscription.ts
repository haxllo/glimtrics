import { prisma } from './prisma';
import { getPlanLimits } from './paddle';

export async function getUserSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    // Create free subscription if it doesn't exist
    return await prisma.subscription.create({
      data: {
        userId,
        plan: 'free',
      },
    });
  }

  return subscription;
}

export async function checkSubscriptionStatus(userId: string) {
  const subscription = await getUserSubscription(userId);
  
  const isPro = subscription.plan === 'pro' && 
    subscription.stripeCurrentPeriodEnd && 
    subscription.stripeCurrentPeriodEnd > new Date();
    
  const isBusiness = subscription.plan === 'business' && 
    subscription.stripeCurrentPeriodEnd && 
    subscription.stripeCurrentPeriodEnd > new Date();

  return {
    ...subscription,
    isPro,
    isBusiness,
    isActive: isPro || isBusiness,
    limits: getPlanLimits(subscription.plan),
  };
}

export async function checkUsageLimit(
  userId: string,
  limitType: 'datasets' | 'insights' | 'pdfExports'
): Promise<{ allowed: boolean; limit: number; current: number }> {
  const status = await checkSubscriptionStatus(userId);
  const limit = status.limits[limitType];

  let current = 0;

  switch (limitType) {
    case 'datasets':
      current = await prisma.dashboard.count({ where: { userId } });
      break;
    case 'insights':
      // Count insights created this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      current = await prisma.insight.count({
        where: {
          dashboard: { userId },
          createdAt: { gte: startOfMonth },
        },
      });
      break;
    case 'pdfExports':
      // For now, just check if they have pro/business plan
      current = status.isActive ? 0 : 1;
      break;
  }

  return {
    allowed: current < limit,
    limit,
    current,
  };
}
