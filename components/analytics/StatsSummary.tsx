import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatsSummaryProps {
  statistics: {
    [column: string]: {
      min: number;
      max: number;
      avg: number;
      sum: number;
      count: number;
    };
  };
  trends?: {
    [column: string]: 'increasing' | 'decreasing' | 'stable';
  };
}

export function StatsSummary({ statistics, trends }: StatsSummaryProps) {
  const columns = Object.keys(statistics);

  if (columns.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500">No numeric columns to analyze</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {columns.map((column) => {
        const stats = statistics[column];
        const trend = trends?.[column];

        return (
          <Card key={column}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{column}</CardTitle>
                {trend && (
                  <Badge variant={trend === 'increasing' ? 'default' : trend === 'decreasing' ? 'destructive' : 'secondary'} className="px-2">
                    {trend === 'increasing' && <TrendingUp className="h-4 w-4" />}
                    {trend === 'decreasing' && <TrendingDown className="h-4 w-4" />}
                    {trend === 'stable' && <Minus className="h-4 w-4" />}
                  </Badge>
                )}
              </div>
              <CardDescription>{stats.count} values</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Average</p>
                  <p className="font-semibold">{stats.avg.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Sum</p>
                  <p className="font-semibold">{stats.sum.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Min</p>
                  <p className="font-semibold">{stats.min.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Max</p>
                  <p className="font-semibold">{stats.max.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
