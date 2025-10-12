import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DatasetsClient } from "./DatasetsClient";

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
          <h1 className="text-3xl font-bold text-white">Datasets</h1>
          <p className="text-gray-400 mt-2">
            View and manage your uploaded datasets
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>Upload New Dataset</Button>
        </Link>
      </div>

      <DatasetsClient dashboards={dashboards} />
    </div>
  );
}
