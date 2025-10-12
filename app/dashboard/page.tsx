import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, FileText, TrendingUp, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const dashboardCount = await prisma.dashboard.count({
    where: { userId: user?.id },
  });

  const insightCount = await prisma.insight.count({
    where: {
      dashboard: {
        userId: user?.id,
      },
    },
  });

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user?.id },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Welcome back, {user?.name || "User"}! Here&apos;s your overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Uploads"
          value={dashboardCount}
          description="Data files uploaded"
          icon={Upload}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="AI Insights"
          value={insightCount}
          description="Generated insights"
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <StatsCard
          title="Active Dashboards"
          value={dashboardCount}
          description="Currently active"
          icon={BarChart3}
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Subscription"
          value={subscription?.plan.toUpperCase() || "FREE"}
          description={subscription?.plan === "free" ? "Upgrade for more features" : "Active plan"}
          icon={FileText}
          iconColor="text-orange-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/upload" className="block">
              <Button className="w-full" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Data
              </Button>
            </Link>
            <Link href="/dashboard/analytics" className="block">
              <Button className="w-full" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Learn how to use AI Dashboards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <p className="text-sm text-gray-700">Upload your CSV or Excel file</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <p className="text-sm text-gray-700">AI analyzes your data automatically</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <p className="text-sm text-gray-700">Get insights, trends, and suggestions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {dashboardCount === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No data uploaded yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Upload your first dataset to start getting AI-powered insights
            </p>
            <Link href="/dashboard/upload">
              <Button>Upload Your First File</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
