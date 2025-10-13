"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function HeroSection() {
  return (
    <motion.section
      className="text-center max-w-4xl mx-auto"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
        variants={fadeInUp}
      >
        Turn Your CSV & Excel Files Into
        <span className="text-green-500"> AI-Powered Insights</span>
      </motion.h1>
      <motion.p
        className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto px-4"
        variants={fadeInUp}
      >
        Upload your spreadsheets (CSV or Excel) and instantly get AI-generated insights, interactive charts, and trend analysis. No setup, no learning curve.
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row justify-center gap-4 mb-16 px-4"
        variants={fadeInUp}
      >
        <Link href="/auth/signup" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg">
            Get Started Free
          </Button>
        </Link>
        <Link href="/auth/login" className="w-full sm:w-auto">
          <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-lg">
            Sign In
          </Button>
        </Link>
      </motion.div>
    </motion.section>
  );
}
