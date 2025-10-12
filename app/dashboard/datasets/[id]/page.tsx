import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { ArrowLeft, Download, BarChart3 } from "lucide-react";
import { DashboardData } from "@/types/dashboard";

export default async function DatasetDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const user = await getCurrentUser();
  const { id } = await params;

  const dashboard = await prisma.dashboard.findUnique({
    where: {
      id,
      userId: user?.id,
    },
  });

  if (!dashboard) {
    redirect("/dashboard/datasets");
  }

  const data = dashboard.data as unknown as DashboardData;
  const headers = data?.headers || [];
  const rows = data?.rows || [];

  const displayRows = rows.slice(0, 50);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/datasets">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{dashboard.name}</h1>
            {dashboard.description && (
              <p className="text-gray-500 mt-1">{dashboard.description}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Link href={`/dashboard/analytics/${dashboard.id}`}>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Rows</CardDescription>
            <CardTitle className="text-3xl">{data?.totalRows || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Columns</CardDescription>
            <CardTitle className="text-3xl">{data?.totalColumns || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>File Type</CardDescription>
            <CardTitle className="text-2xl uppercase">{data?.fileType || "N/A"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Uploaded</CardDescription>
            <CardTitle className="text-lg">
              {new Date(dashboard.createdAt).toLocaleDateString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dataset Preview</CardTitle>
          <CardDescription>
            {displayRows.length < rows.length
              ? `Showing first ${displayRows.length} of ${rows.length} rows`
              : `Showing all ${rows.length} rows`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  {headers.map((header: string, index: number) => (
                    <TableHead key={index} className="min-w-[150px]">
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayRows.map((row: Record<string, unknown>, rowIndex: number) => (
                  <TableRow key={rowIndex}>
                    <TableCell className="font-medium text-gray-500">
                      {rowIndex + 1}
                    </TableCell>
                    {headers.map((header: string, colIndex: number) => {
                      const value = row[header];
                      const stringValue = value !== null && value !== undefined ? String(value) : "-";
                      const truncated = stringValue.length > 100 
                        ? stringValue.substring(0, 100) + "..." 
                        : stringValue;
                      
                      return (
                        <TableCell key={colIndex} className="max-w-xs">
                          <div className="truncate" title={stringValue}>
                            {truncated}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {displayRows.length < rows.length && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                Showing first 50 rows. Export full dataset to view all data.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
