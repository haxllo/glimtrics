"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InsightCard } from "./InsightCard";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

interface Insight {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: Date;
}

interface InsightsSectionProps {
  dashboardId: string;
  initialInsights?: Insight[];
}

export function InsightsSection({ dashboardId, initialInsights = [] }: InsightsSectionProps) {
  const [insights, setInsights] = useState<Insight[]>(initialInsights);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/insights/${dashboardId}`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate insights");
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate insights");
      console.error("Error generating insights:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (insights.length === 0 && !error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Sparkles className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            AI Insights Available
          </h3>
          <p className="text-gray-600 text-center mb-6 max-w-md">
            Generate intelligent insights about your data using AI. Discover trends, anomalies, and get actionable recommendations.
          </p>
          <Button onClick={handleGenerateInsights} disabled={isGenerating} size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating Insights...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate AI Insights
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Insights</h2>
          <p className="text-gray-600 mt-1">
            {insights.length} insight{insights.length !== 1 ? 's' : ''} generated
          </p>
        </div>
        <Button
          onClick={handleGenerateInsights}
          disabled={isGenerating}
          variant="outline"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Regenerate
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            type={insight.type}
            title={insight.title}
            description={insight.description}
            createdAt={insight.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
