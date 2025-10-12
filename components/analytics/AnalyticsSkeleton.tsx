"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>

      {/* Insights skeleton */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>

      {/* Stats + Filters skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Skeleton className="h-64 w-full" />
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
