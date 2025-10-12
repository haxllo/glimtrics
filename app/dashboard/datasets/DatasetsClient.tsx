"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { DatasetCard } from "@/components/datasets/DatasetCard";

interface Dashboard {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  data: unknown;
  _count: {
    insights: number;
  };
}

interface DatasetsClientProps {
  dashboards: Dashboard[];
}

export function DatasetsClient({ dashboards }: DatasetsClientProps) {
  if (dashboards.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No datasets yet
          </h3>
          <p className="text-gray-400 text-center mb-6">
            Upload your first CSV or Excel file to get started
          </p>
          <Link href="/dashboard/upload">
            <Button>Upload Dataset</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dashboards.map((dashboard) => (
        <DatasetCard key={dashboard.id} dashboard={dashboard} />
      ))}
    </div>
  );
}
