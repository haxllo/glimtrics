import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe, getPlanFromPriceId } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        const userId = session.metadata?.userId;

        if (userId && subscriptionId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
          const priceId = stripeSubscription.items.data[0].price.id;
          const plan = getPlanFromPriceId(priceId);
          const periodEnd = new Date(stripeSubscription['current_period_end'] * 1000);

          await prisma.subscription.update({
            where: { userId },
            data: {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: periodEnd,
              plan,
            },
          });

          console.log('[Stripe] Subscription created for user:', userId);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
          const priceId = stripeSubscription.items.data[0].price.id;
          const plan = getPlanFromPriceId(priceId);
          const periodEnd = new Date(stripeSubscription['current_period_end'] * 1000);

          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              stripePriceId: priceId,
              stripeCurrentPeriodEnd: periodEnd,
              plan,
            },
          });

          console.log('[Stripe] Payment succeeded for subscription:', subscriptionId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
            plan: 'free',
          },
        });

        console.log('[Stripe] Subscription canceled:', subscription.id);
        break;
      }

      case 'customer.subscription.updated': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any;
        const priceId = subscription.items.data[0].price.id;
        const plan = getPlanFromPriceId(priceId);
        const periodEnd = new Date(subscription['current_period_end'] * 1000);

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: periodEnd,
            plan,
          },
        });

        console.log('[Stripe] Subscription updated:', subscription.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe] Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
