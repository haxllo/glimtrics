"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for trying out our platform",
    features: [
      "1 dataset upload",
      "5 AI insights per month",
      "Basic charts & visualizations",
      "Community support",
    ],
    priceId: null,
    popular: false,
  },
  {
    name: "Pro",
    price: "$14.99",
    description: "For professionals and small teams",
    features: [
      "Unlimited datasets",
      "Unlimited AI insights",
      "All chart types",
      "PDF export",
      "Priority support",
      "Advanced analytics",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    popular: true,
  },
  {
    name: "Business",
    price: "$49.99",
    description: "For growing businesses",
    features: [
      "Everything in Pro",
      "Multi-user dashboards",
      "Team collaboration",
      "API access",
      "White-label reports",
      "Dedicated support",
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
    popular: false,
  },
];

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null | undefined) => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/pricing");
      return;
    }

    if (!priceId) {
      router.push("/dashboard");
      return;
    }

    setLoadingPriceId(priceId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to start checkout. Please try again.");
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Choose the plan that&apos;s right for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular ? "border-indigo-500 border-2 shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== "$0" && (
                    <span className="text-gray-600">/month</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(plan.priceId)}
                  disabled={loadingPriceId !== null}
                  className={`w-full ${
                    plan.popular
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {loadingPriceId === plan.priceId ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : plan.price === "$0" ? (
                    "Get Started"
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Have questions? <Link href="/contact" className="text-indigo-600 hover:text-indigo-700">Contact us</Link>
          </p>
          {session && (
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
