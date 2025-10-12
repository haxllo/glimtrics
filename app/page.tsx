"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/UserNav";
import { BarChart3, TrendingUp, Upload, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn, fadeInUp, staggerContainer, featureCard } from "@/lib/animations";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-2xl font-bold text-white">AI Dashboards</h2>
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
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            Turn Your CSV & Excel Files Into
            <span className="text-green-500"> AI-Powered Insights</span>
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto px-4"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Upload your spreadsheets (CSV or Excel) and instantly get AI-generated insights, interactive charts, and trend analysis. No setup, no learning curve.
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
              className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg"
              initial="initial"
              whileInView="animate"
              whileHover="whileHover"
              viewport={{ once: true, margin: "-100px" }}
              variants={featureCard}
            >
              <Upload className="h-10 w-10 text-green-500 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2 text-white">Easy Upload</h3>
              <p className="text-gray-400 text-sm">
                CSV, Excel (.xlsx, .xls) - Upload in seconds
              </p>
            </motion.div>
            <motion.div 
              className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg"
              initial="initial"
              whileInView="animate"
              whileHover="whileHover"
              viewport={{ once: true, margin: "-100px" }}
              variants={featureCard}
            >
              <Zap className="h-10 w-10 text-yellow-500 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2 text-white">AI Analysis</h3>
              <p className="text-gray-400 text-sm">
                Automatic trend detection and insights
              </p>
            </motion.div>
            <motion.div 
              className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg"
              initial="initial"
              whileInView="animate"
              whileHover="whileHover"
              viewport={{ once: true, margin: "-100px" }}
              variants={featureCard}
            >
              <BarChart3 className="h-10 w-10 text-blue-500 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2 text-white">Beautiful Charts</h3>
              <p className="text-gray-400 text-sm">
                Interactive visualizations for your data
              </p>
            </motion.div>
            <motion.div 
              className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg"
              initial="initial"
              whileInView="animate"
              whileHover="whileHover"
              viewport={{ once: true, margin: "-100px" }}
              variants={featureCard}
            >
              <TrendingUp className="h-10 w-10 text-green-500 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2 text-white">Actionable Insights</h3>
              <p className="text-gray-400 text-sm">
                Get suggestions to improve your business
              </p>
            </motion.div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div 
            className="mt-20 px-4"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-white text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-green-500">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Upload Your Data</h3>
                <p className="text-gray-400">Drop your CSV or Excel file. We support any tabular data format.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-green-500">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Analyzes Everything</h3>
                <p className="text-gray-400">Our AI automatically detects patterns, trends, and anomalies in seconds.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-green-500">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Get Insights & Charts</h3>
                <p className="text-gray-400">View interactive charts, statistics, and actionable recommendations.</p>
              </div>
            </div>
          </motion.div>

          {/* Use Cases Section */}
          <motion.div 
            className="mt-20 px-4"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white text-center">Perfect For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg text-center">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-white mb-2">Small Businesses</h3>
                <p className="text-sm text-gray-400">Track sales, inventory, and customer data</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg text-center">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-semibold text-white mb-2">Content Creators</h3>
                <p className="text-sm text-gray-400">Analyze engagement and growth metrics</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg text-center">
                <div className="text-3xl mb-3">🎓</div>
                <h3 className="font-semibold text-white mb-2">Students & Researchers</h3>
                <p className="text-sm text-gray-400">Visualize survey and experiment data</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg text-center">
                <div className="text-3xl mb-3">💼</div>
                <h3 className="font-semibold text-white mb-2">Freelancers</h3>
                <p className="text-sm text-gray-400">Monitor projects and client metrics</p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div 
            className="mt-20 px-4 max-w-3xl mx-auto"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold text-white mb-2">What file formats do you support?</h3>
                <p className="text-gray-400">We support CSV and Excel files (.xlsx, .xls). Any tabular data works!</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold text-white mb-2">How does the AI analysis work?</h3>
                <p className="text-gray-400">We use GPT-4 to analyze your data, detect patterns, identify trends, and provide actionable insights automatically.</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Is my data secure?</h3>
                <p className="text-gray-400">Yes! Your data is encrypted and stored securely. We never share your data with third parties.</p>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Can I export my insights?</h3>
                <p className="text-gray-400">Absolutely! Export your charts and insights as PDF or CSV files anytime.</p>
              </div>
            </div>
          </motion.div>

          {/* Pricing CTA */}
          <motion.div 
            className="mt-20 p-8 bg-gray-900/50 border border-gray-800 rounded-lg backdrop-blur-sm mx-4"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Simple Pricing</h2>
            <p className="text-gray-400 mb-6">Start free, upgrade when you need more</p>
            <div className="inline-block">
              <div className="text-3xl sm:text-4xl font-bold text-green-500">Free - $49.99/mo</div>
              <p className="text-gray-400 mt-2">Plans for every need</p>
            </div>
            <div className="mt-6">
              <Link href="/pricing">
                <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">View All Plans</Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
