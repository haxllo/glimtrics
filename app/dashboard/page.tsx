import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { BarChart3, FileText, TrendingUp, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardData } from "@/types/dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    return <div>Please log in to access the dashboard.</div>;
  }

  const dashboardCount = await prisma.dashboard.count({
    where: { userId: user.id },
  });

  const insightCount = await prisma.insight.count({
    where: {
      dashboard: {
        userId: user.id,
      },
    },
  });

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  const recentDashboards = await prisma.dashboard.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-2">
          Welcome back, {user?.name || "User"}! Here&apos;s your overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Uploads"
          value={dashboardCount}
          description="Data files uploaded"
          icon={Upload}
          iconColor="text-green-500"
        />
        <StatsCard
          title="AI Insights"
          value={insightCount}
          description="Generated insights"
          icon={TrendingUp}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Active Dashboards"
          value={dashboardCount}
          description="Currently active"
          icon={BarChart3}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Subscription"
          value={subscription?.plan.toUpperCase() || "FREE"}
          description={subscription?.plan === "free" ? "Upgrade for more features" : "Active plan"}
          icon={FileText}
          iconColor="text-green-500"
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
            <CardDescription>Learn how to use Glimtrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <p className="text-sm text-gray-400">Upload your CSV or Excel file</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <p className="text-sm text-gray-400">AI analyzes your data automatically</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <p className="text-sm text-gray-400">Get insights, trends, and suggestions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {dashboardCount === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No data uploaded yet</h3>
            <p className="text-gray-400 text-center mb-4">
              Upload your first dataset to start getting AI-powered insights
            </p>
            <Link href="/dashboard/upload">
              <Button>Upload Your First File</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Datasets</CardTitle>
                <CardDescription>Your recently uploaded files</CardDescription>
              </div>
              <Link href="/dashboard/datasets">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentDashboards.map((dashboard) => {
              const data = dashboard.data as unknown as DashboardData;
              return (
                <Link
                  key={dashboard.id}
                  href={`/dashboard/datasets/${dashboard.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 border border-gray-800 rounded-lg hover:bg-gray-800/50 transition">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{dashboard.name}</h3>
                      <p className="text-sm text-gray-400">
                        {data?.totalRows || 0} rows • {data?.totalColumns || 0} columns
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(dashboard.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
