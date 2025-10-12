"use client";

import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Download } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DashboardData } from "@/types/dashboard";
import { analyzeData, filterData, calculateTrend, type AnalyticsData } from "@/lib/analytics";
import { DataChart } from "@/components/charts/DataChart";
import { MultiLineChart } from "@/components/charts/MultiLineChart";
import { StatsSummary } from "@/components/analytics/StatsSummary";
import { DataFilters, type FilterState } from "@/components/analytics/DataFilters";
import { InsightsSection } from "@/components/insights/InsightsSection";
import { AIAssistant } from "@/components/insights/AIAssistant";
import { AnalyticsSkeleton } from "@/components/analytics/AnalyticsSkeleton";
import { exportAnalyticsToPDF, exportInsightsToPDF } from "@/lib/pdf-export";
import { exportToCSV, exportStatisticsToCSV } from "@/lib/csv-export";

interface Dashboard {
  id: string;
  name: string;
  data: unknown;
}

interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: Date;
}

export default function AnalyticsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [filteredData, setFilteredData] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trends, setTrends] = useState<{ [key: string]: 'increasing' | 'decreasing' | 'stable' }>({});
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch(`/api/dashboard/${resolvedParams.id}`);
        if (!response.ok) {
          router.push("/dashboard/datasets");
          return;
        }
        const data = await response.json();
        setDashboard(data);

        const dashboardData = data.data as unknown as DashboardData;
        const analyticsData = analyzeData(dashboardData);
        setAnalytics(analyticsData);
        setFilteredData(dashboardData.rows);

        const trendsData: { [key: string]: 'increasing' | 'decreasing' | 'stable' } = {};
        analyticsData.summary.numericColumns.forEach((col) => {
          const values = dashboardData.rows
            .map((row) => {
              const val = row[col];
              return typeof val === 'number' ? val : parseFloat(String(val));
            })
            .filter((val) => !isNaN(val));
          trendsData[col] = calculateTrend(values);
        });
        setTrends(trendsData);

        // Fetch existing insights
        const insightsResponse = await fetch(`/api/insights/${resolvedParams.id}`);
        if (insightsResponse.ok) {
          const insightsData = await insightsResponse.json();
          setInsights(insightsData.insights || []);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
        router.push("/dashboard/datasets");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboard();
  }, [resolvedParams.id, router]);

  const handleFilterChange = useCallback((filters: FilterState) => {
    if (!dashboard) return;

    const dashboardData = dashboard.data as unknown as DashboardData;
    const filtered = filterData(dashboardData.rows, filters);
    setFilteredData(filtered);
  }, [dashboard]);

  const handleExportPDF = async () => {
    if (!dashboard || !analytics) return;

    try {
      await exportAnalyticsToPDF('analytics-container', {
        filename: `${dashboard.name}-analytics-${Date.now()}.pdf`,
        datasetName: dashboard.name,
        insights: insights.map(i => ({
          type: i.type,
          title: i.title,
          description: i.description,
        })),
        statistics: analytics.statistics,
      });
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Failed to export PDF");
    }
  };

  const handleExportInsightsPDF = async () => {
    if (!dashboard || insights.length === 0) return;

    try {
      await exportInsightsToPDF(
        insights.map(i => ({
          type: i.type,
          title: i.title,
          description: i.description,
        })),
        dashboard.name
      );
      toast.success("Insights exported successfully");
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error("Failed to export PDF");
    }
  };

  const handleExportCSV = () => {
    if (!dashboard) return;

    try {
      const dashboardData = dashboard.data as unknown as DashboardData;
      exportToCSV(filteredData, `${dashboard.name}-data-${Date.now()}.csv`);
      toast.success("CSV exported successfully");
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error("Failed to export CSV");
    }
  };

  const handleExportStatisticsCSV = () => {
    if (!analytics) return;

    try {
      exportStatisticsToCSV(analytics.statistics, `${dashboard?.name}-statistics-${Date.now()}.csv`);
      toast.success("Statistics exported successfully");
    } catch (error) {
      console.error('CSV export error:', error);
      toast.error("Failed to export statistics");
    }
  };

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (!dashboard || !analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-400">Dashboard not found</p>
          <Link href="/dashboard/datasets">
            <Button className="mt-4">Back to Datasets</Button>
          </Link>
        </div>
      </div>
    );
  }

  const dashboardData = dashboard.data as unknown as DashboardData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/dashboard/datasets/${resolvedParams.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics: {dashboard.name}</h1>
            <p className="text-gray-400 mt-1">
              {filteredData.length} rows • {dashboardData.headers.length} columns
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleExportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleExportStatisticsCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Stats
          </Button>
          <Button onClick={handleExportPDF} variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            PDF Full
          </Button>
          {insights.length > 0 && (
            <Button onClick={handleExportInsightsPDF} variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              PDF Insights
            </Button>
          )}
        </div>
      </div>

      <div className="mb-8">
        <InsightsSection dashboardId={resolvedParams.id} initialInsights={insights} />
      </div>

      <div id="analytics-container" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <DataFilters
            columns={dashboardData.headers}
            numericColumns={analytics.summary.numericColumns}
            textColumns={analytics.summary.textColumns}
            statistics={analytics.statistics}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Summary Statistics</h2>
            <StatsSummary statistics={analytics.statistics} trends={trends} />
          </div>

          {analytics.summary.numericColumns.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Numeric Data Visualizations</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analytics.summary.numericColumns.slice(0, 4).map((column) => (
                  <DataChart
                    key={column}
                    data={analytics.chartData[column] || []}
                    title={column}
                    description={`Distribution of ${column} values`}
                    type="line"
                    height={250}
                  />
                ))}
              </div>
            </div>
          )}

          {analytics.summary.numericColumns.length > 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Comparison Chart</h2>
              <MultiLineChart
                data={filteredData.slice(0, 50).map((row, idx) => {
                  const dataPoint: Record<string, string | number> = { name: `Row ${idx + 1}` };
                  analytics.summary.numericColumns.slice(0, 3).forEach((col) => {
                    const val = row[col];
                    dataPoint[col] = typeof val === 'number' ? val : parseFloat(String(val)) || 0;
                  });
                  return dataPoint;
                })}
                title="Multi-Column Comparison"
                description="Compare trends across different columns"
                lines={analytics.summary.numericColumns.slice(0, 3).map((col) => ({
                  dataKey: col,
                  name: col,
                }))}
              />
            </div>
          )}

          {Object.keys(analytics.categoryDistribution).length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(analytics.categoryDistribution).slice(0, 4).map(([column, distribution]) => (
                  <DataChart
                    key={column}
                    data={distribution}
                    title={column}
                    description={`Top ${distribution.length} categories`}
                    type="pie"
                    height={300}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant Floating Button */}
      <AIAssistant dashboardId={resolvedParams.id} datasetName={dashboard.name} />
    </div>
  );
}
