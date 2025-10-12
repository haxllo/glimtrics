"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { initializePaddle, Paddle } from '@paddle/paddle-js';
import { motion } from "framer-motion";
import { staggerContainer, useCaseCard } from "@/lib/animations";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Perfect for trying out our platform",
    features: [
      "1 dataset upload",
      "5 AI insights per month",
      "Basic charts & visualizations",
      "Community support",
    ],
    monthlyPriceId: null,
    annualPriceId: null,
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: 14.99,
    annualPrice: 149.99, // ~$12.50/month
    description: "For professionals and small teams",
    features: [
      "Unlimited datasets",
      "Unlimited AI insights",
      "All chart types",
      "PDF export",
      "Priority support",
      "Advanced analytics",
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID,
    annualPriceId: process.env.NEXT_PUBLIC_PADDLE_PRO_ANNUAL_PRICE_ID,
    popular: true,
  },
  {
    name: "Business",
    monthlyPrice: 49.99,
    annualPrice: 499.99, // ~$41.67/month
    description: "For growing businesses",
    features: [
      "Everything in Pro",
      "Multi-user dashboards",
      "Team collaboration",
      "API access",
      "White-label reports",
      "Dedicated support",
    ],
    monthlyPriceId: process.env.NEXT_PUBLIC_PADDLE_BUSINESS_PRICE_ID,
    annualPriceId: process.env.NEXT_PUBLIC_PADDLE_BUSINESS_ANNUAL_PRICE_ID,
    popular: false,
  },
];

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const clientSideToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    
    if (clientSideToken) {
      const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production' ? 'production' : 'sandbox';
      initializePaddle({ 
        environment,
        token: clientSideToken,
      }).then(
        (paddleInstance: Paddle | undefined) => {
          if (paddleInstance) {
            setPaddle(paddleInstance);
          }
        },
      );
    }
  }, []);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    const priceId = billingCycle === 'monthly' ? plan.monthlyPriceId : plan.annualPriceId;
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/pricing");
      return;
    }

    if (!priceId || plan.monthlyPrice === 0) {
      // Free plan - go to dashboard
      router.push("/dashboard");
      return;
    }

    // Debug logging
    console.log('Paddle instance:', paddle);
    console.log('Price ID:', priceId);
    console.log('Client Token:', process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN);

    if (!paddle) {
      alert("Payment system is not initialized. Please make sure Paddle environment variables are set in .env file.");
      console.error('Paddle not initialized. Check NEXT_PUBLIC_PADDLE_CLIENT_TOKEN in .env');
      return;
    }

    setLoadingPriceId(priceId);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const checkoutConfig: any = {
        items: [{ priceId, quantity: 1 }],
        customData: {
          userId: session?.user?.id,
        },
        successCallback: () => {
          router.push('/dashboard?success=true');
        },
      };

      if (session?.user?.email) {
        checkoutConfig.customer = { email: session.user.email };
      }

      console.log('Opening Paddle checkout with config:', checkoutConfig);
      paddle.Checkout.open(checkoutConfig);
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Choose the plan that&apos;s right for you
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white font-semibold' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative w-14 h-7 bg-gray-700 rounded-full transition-colors hover:bg-gray-600"
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-green-500 rounded-full transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm ${billingCycle === 'annual' ? 'text-white font-semibold' : 'text-gray-400'}`}>
              Annual
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={useCaseCard}
              className="gpu-accelerated"
            >
              <Card
                className={`relative h-full bg-gray-900/50 border-gray-800 ${
                  plan.popular ? "border-green-500 border-2 shadow-lg shadow-green-500/20" : ""
                }`}
              >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                  </span>
                  {plan.monthlyPrice !== 0 && (
                    <span className="text-gray-400">
                      {billingCycle === 'monthly' ? '/month' : '/year'}
                    </span>
                  )}
                </div>
                {billingCycle === 'annual' && plan.annualPrice > 0 && (
                  <p className="text-sm text-gray-400 mt-1">
                    ${(plan.annualPrice / 12).toFixed(2)}/month billed annually
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPriceId !== null}
                  className={`w-full text-sm sm:text-base ${
                    plan.popular
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "border-gray-700 hover:border-green-500 hover:bg-green-500/10"
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {loadingPriceId === (billingCycle === 'monthly' ? plan.monthlyPriceId : plan.annualPriceId) ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : plan.monthlyPrice === 0 ? (
                    "Get Started Free"
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>
              </CardFooter>
            </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Comparison Table */}
        <div className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Compare Features</h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-semibold">Feature</th>
                  <th className="text-center p-4 text-gray-400 font-semibold">Free</th>
                  <th className="text-center p-4 text-gray-400 font-semibold">Pro</th>
                  <th className="text-center p-4 text-gray-400 font-semibold">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr>
                  <td className="p-4 text-gray-300">Datasets</td>
                  <td className="text-center p-4 text-gray-400">1</td>
                  <td className="text-center p-4 text-white">Unlimited</td>
                  <td className="text-center p-4 text-white">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-300">AI Insights</td>
                  <td className="text-center p-4 text-gray-400">5/month</td>
                  <td className="text-center p-4 text-white">Unlimited</td>
                  <td className="text-center p-4 text-white">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-300">Charts & Visualizations</td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-gray-400 inline" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 inline" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 inline" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-300">PDF Export</td>
                  <td className="text-center p-4 text-gray-600">—</td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 inline" /></td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 inline" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-300">Team Collaboration</td>
                  <td className="text-center p-4 text-gray-600">—</td>
                  <td className="text-center p-4 text-gray-600">—</td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 inline" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-300">API Access</td>
                  <td className="text-center p-4 text-gray-600">—</td>
                  <td className="text-center p-4 text-gray-600">—</td>
                  <td className="text-center p-4"><Check className="h-5 w-5 text-green-500 inline" /></td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-300">Support</td>
                  <td className="text-center p-4 text-gray-400">Community</td>
                  <td className="text-center p-4 text-white">Priority</td>
                  <td className="text-center p-4 text-white">Dedicated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16 text-center space-y-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">Need to Downgrade?</h3>
            <p className="text-gray-400 mb-4">
              You can downgrade to the Free plan anytime from your settings. Your data will be preserved, but you&apos;ll be limited to the Free plan features.
            </p>
            <p className="text-sm text-gray-500">
              Free plan includes: 1 dataset, 5 AI insights per month, basic charts, and community support.
            </p>
          </div>
          
          <div>
            <p className="text-gray-400 mb-4">
              All prices in USD. Need a custom plan? <Link href="/dashboard/settings" className="text-green-500 hover:text-green-400 underline">Contact our team</Link>
            </p>
            <p className="text-xs text-gray-500">
              Paddle securely processes payments in 200+ countries.
            </p>
            {session && (
              <Link href="/dashboard">
                <Button variant="outline" className="border-gray-700 hover:border-green-500 text-gray-300">Back to Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
