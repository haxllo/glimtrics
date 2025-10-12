"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/UserNav";
import { BarChart3, TrendingUp, Upload, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer } from "@/lib/animations";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">AI Dashboards</h2>
        <UserNav />
      </nav>

      <main className="container mx-auto px-4 py-16">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            AI-Powered Analytics for Everyone
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto px-4"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Upload your data and get instant AI-powered insights, trends, and actionable suggestions. 
            Perfect for small businesses and creators.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16 px-4"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
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

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 px-4"
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Upload className="h-10 w-10 text-blue-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Easy Upload</h3>
              <p className="text-gray-600 text-sm">
                Upload CSV or Excel files in seconds
              </p>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Zap className="h-10 w-10 text-yellow-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
              <p className="text-gray-600 text-sm">
                Automatic trend detection and insights
              </p>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <BarChart3 className="h-10 w-10 text-purple-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Beautiful Charts</h3>
              <p className="text-gray-600 text-sm">
                Interactive visualizations for your data
              </p>
            </motion.div>
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md"
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <TrendingUp className="h-10 w-10 text-green-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Actionable Insights</h3>
              <p className="text-gray-600 text-sm">
                Get suggestions to improve your business
              </p>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-16 p-8 bg-white rounded-lg shadow-lg mx-4"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-600 mb-6">Start free, upgrade when you need more</p>
            <div className="inline-block">
              <div className="text-3xl sm:text-4xl font-bold text-indigo-600">$12-34/month</div>
              <p className="text-gray-500 mt-2">Free tier available</p>
            </div>
            <div className="mt-6">
              <Link href="/pricing">
                <Button variant="outline">View All Plans</Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
