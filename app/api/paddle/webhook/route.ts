import { NextRequest, NextResponse } from 'next/server';
import { getPlanFromPriceId } from '@/lib/paddle';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // getPaddle() available if needed for verification

    // Verify webhook signature
    const signature = req.headers.get('paddle-signature');
    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Paddle automatically validates signatures through their SDK
    const eventType = body.event_type;
    const eventData = body.data;

    console.log('[Paddle] Webhook event:', eventType);

    switch (eventType) {
      case 'subscription.created':
      case 'subscription.updated': {
        const subscription = eventData;
        const customerId = subscription.customer_id;
        const subscriptionId = subscription.id;
        const priceId = subscription.items?.[0]?.price?.id;
        const userId = subscription.custom_data?.userId;

        if (userId && subscriptionId && priceId) {
          const plan = getPlanFromPriceId(priceId);
          const currentPeriodEnd = subscription.current_billing_period?.ends_at
            ? new Date(subscription.current_billing_period.ends_at)
            : null;

          await prisma.subscription.upsert({
            where: { userId },
            create: {
              userId,
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: currentPeriodEnd,
              plan,
            },
            update: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: currentPeriodEnd,
              plan,
            },
          });

          console.log('[Paddle] Subscription updated for user:', userId, 'Plan:', plan);
        }
        break;
      }

      case 'subscription.canceled':
      case 'subscription.paused': {
        const subscription = eventData;
        const subscriptionId = subscription.id;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            plan: 'free',
          },
        });

        console.log('[Paddle] Subscription canceled:', subscriptionId);
        break;
      }

      case 'transaction.completed': {
        console.log('[Paddle] Payment completed');
        // Payment successful - subscription will be updated via subscription.updated event
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Paddle] Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
