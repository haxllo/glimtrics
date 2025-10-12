import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, FileText, Trash2 } from "lucide-react";
import { DashboardData } from "@/types/dashboard";

export default async function DatasetsPage() {
  const user = await getCurrentUser();

  const dashboards = await prisma.dashboard.findMany({
    where: {
      userId: user?.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { insights: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Datasets</h1>
          <p className="text-gray-500 mt-2">
            View and manage your uploaded datasets
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>Upload New Dataset</Button>
        </Link>
      </div>

      {dashboards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No datasets yet
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Upload your first CSV or Excel file to get started
            </p>
            <Link href="/dashboard/upload">
              <Button>Upload Dataset</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => {
            const data = dashboard.data as unknown as DashboardData;
            const totalRows = data?.totalRows || 0;
            const totalColumns = data?.totalColumns || 0;

            return (
              <Card key={dashboard.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{dashboard.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {dashboard.description || "No description"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">Rows</p>
                      <p className="text-lg font-bold text-gray-900">{totalRows}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <p className="text-xs text-gray-600">Columns</p>
                      <p className="text-lg font-bold text-gray-900">{totalColumns}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(dashboard.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/dashboard/datasets/${dashboard.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Data
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
