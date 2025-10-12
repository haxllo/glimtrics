import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, Lightbulb, FileText } from "lucide-react";

interface InsightCardProps {
  type: string;
  title: string;
  description: string;
  createdAt?: Date;
}

const typeConfig = {
  trend: {
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    badgeVariant: "default" as const,
    label: "Trend",
  },
  anomaly: {
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    badgeVariant: "destructive" as const,
    label: "Anomaly",
  },
  recommendation: {
    icon: Lightbulb,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    badgeVariant: "secondary" as const,
    label: "Recommendation",
  },
  summary: {
    icon: FileText,
    color: "text-green-600",
    bgColor: "bg-green-50",
    badgeVariant: "secondary" as const,
    label: "Summary",
  },
};

export function InsightCard({ type, title, description, createdAt }: InsightCardProps) {
  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.summary;
  const Icon = config.icon;

  return (
    <Card className="hover:shadow-md transition">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Icon className={`h-5 w-5 ${config.color}`} />
          </div>
          <Badge variant={config.badgeVariant}>{config.label}</Badge>
        </div>
        <CardTitle className="text-lg mt-3">{title}</CardTitle>
        {createdAt && (
          <CardDescription className="text-xs">
            Generated {new Date(createdAt).toLocaleString()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
