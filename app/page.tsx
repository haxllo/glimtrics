import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/layout/UserNav";
import { BarChart3, TrendingUp, Upload, Zap } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { ScrollFade } from "@/components/home/ScrollFade";

const features = [
  {
    title: "Easy Upload",
    description: "CSV, Excel (.xlsx, .xls) - Upload in seconds",
    icon: Upload,
    accent: "text-green-500",
  },
  {
    title: "AI Analysis",
    description: "Automatic trend detection and insights",
    icon: Zap,
    accent: "text-yellow-500",
  },
  {
    title: "Beautiful Charts",
    description: "Interactive visualizations for your data",
    icon: BarChart3,
    accent: "text-blue-500",
  },
  {
    title: "Actionable Insights",
    description: "Get suggestions to improve your business",
    icon: TrendingUp,
    accent: "text-green-500",
  },
];

const howItWorks = [
  {
    label: "1",
    title: "Upload Your Data",
    description: "Drop your CSV or Excel file. We support any tabular data format.",
  },
  {
    label: "2",
    title: "AI Analyzes Everything",
    description: "Our AI automatically detects patterns, trends, and anomalies in seconds.",
  },
  {
    label: "3",
    title: "Get Insights & Charts",
    description: "View interactive charts, statistics, and actionable recommendations.",
  },
];

const useCases = [
  {
    icon: "📊",
    title: "Small Businesses",
    description: "Track sales, inventory, and customer data",
  },
  {
    icon: "📈",
    title: "Content Creators",
    description: "Analyze engagement and growth metrics",
  },
  {
    icon: "🎓",
    title: "Students & Researchers",
    description: "Visualize survey and experiment data",
  },
  {
    icon: "💼",
    title: "Freelancers",
    description: "Monitor projects and client metrics",
  },
];

const faqs = [
  {
    question: "What file formats do you support?",
    answer: "We support CSV and Excel files (.xlsx, .xls). Any tabular data works!",
  },
  {
    question: "How does the AI analysis work?",
    answer: "We use GPT-4 to analyze your data, detect patterns, identify trends, and provide actionable insights automatically.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes! Your data is encrypted and stored securely. We never share your data with third parties.",
  },
  {
    question: "Can I export my insights?",
    answer: "Absolutely! Export your charts and insights as PDF or CSV files anytime.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen text-white">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center border-b border-white/10">
        <h2 className="text-2xl font-bold text-white">Glimtrics</h2>
        <UserNav />
      </nav>

      <main className="relative z-10 container mx-auto px-4 py-16 space-y-20">
        <HeroSection />

        <ScrollFade className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {features.map(({ title, description, icon: Icon, accent }) => (
            <article
              key={title}
              className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg text-center"
            >
              <Icon className={`h-10 w-10 mb-4 mx-auto ${accent}`} />
              <h3 className="font-semibold text-lg mb-2 text-white">{title}</h3>
              <p className="text-gray-400 text-sm">{description}</p>
            </article>
          ))}
        </ScrollFade>

        <section className="px-4">
          <ScrollFade delay={0.1} className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-12 text-white">How It Works</h2>
          </ScrollFade>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map(({ label, title, description }) => (
              <ScrollFade key={label} delay={0.1} className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-green-500">{label}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400">{description}</p>
              </ScrollFade>
            ))}
          </div>
        </section>

        <section className="px-4">
          <ScrollFade delay={0.1} className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white">Perfect For</h2>
          </ScrollFade>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {useCases.map(({ icon, title, description }) => (
              <ScrollFade
                key={title}
                delay={0.1}
                className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg text-center"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400">{description}</p>
              </ScrollFade>
            ))}
          </div>
        </section>

        <section className="px-4 max-w-3xl mx-auto">
          <ScrollFade delay={0.1} className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white">
              Frequently Asked Questions
            </h2>
          </ScrollFade>
          <div className="space-y-4">
            {faqs.map(({ question, answer }) => (
              <ScrollFade
                key={question}
                delay={0.1}
                className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg"
              >
                <h3 className="font-semibold text-white mb-2">{question}</h3>
                <p className="text-gray-400">{answer}</p>
              </ScrollFade>
            ))}
          </div>
        </section>

        <ScrollFade delay={0.1} className="p-8 bg-gray-900/50 border border-gray-800 rounded-lg mx-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Simple Pricing</h2>
          <p className="text-gray-400 mb-6">Start free, upgrade when you need more</p>
          <div className="inline-block">
            <div className="text-3xl sm:text-4xl font-bold text-green-500">Free - $49.99/mo</div>
            <p className="text-gray-400 mt-2">Plans for every need</p>
          </div>
          <div className="mt-6">
            <Link href="/pricing">
              <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
                View All Plans
              </Button>
            </Link>
          </div>
        </ScrollFade>
      </main>
    </div>
  );
}
