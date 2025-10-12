"use client";

import { useState, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, Trash2 } from "lucide-react";
import { EditDatasetDialog } from "./EditDatasetDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getDashboardStats } from "@/lib/prisma-helpers";

interface DatasetCardProps {
  dashboard: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    data: unknown;
  };
}

function DatasetCardComponent({ dashboard }: DatasetCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { totalRows, totalColumns } = getDashboardStats(dashboard.data);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/dashboard/${dashboard.id}/delete`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete dataset");
      }

      toast.success("Dataset deleted successfully");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete dataset");
      setIsDeleting(false);
    }
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition">
      <CardHeader>
        <CardTitle className="line-clamp-1">{dashboard.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {dashboard.description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-800/50 rounded">
            <p className="text-xs text-gray-400">Rows</p>
            <p className="text-lg font-bold text-white">{totalRows}</p>
          </div>
          <div className="p-3 bg-gray-800/50 rounded">
            <p className="text-xs text-gray-400">Columns</p>
            <p className="text-lg font-bold text-white">{totalColumns}</p>
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          {new Date(dashboard.createdAt).toLocaleDateString()}
        </div>

        <div className="space-y-2">
          <div className="flex space-x-2">
            <Link href={`/dashboard/datasets/${dashboard.id}`} className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                View Data
              </Button>
            </Link>
            <Link href={`/dashboard/analytics/${dashboard.id}`} className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                <BarChart3 className="h-4 w-4 mr-1" />
                Analytics
              </Button>
            </Link>
          </div>
          
          <EditDatasetDialog
            dataset={{
              id: dashboard.id,
              name: dashboard.name,
              description: dashboard.description,
            }}
          />
          
          <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-red-500 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900 border-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This will permanently delete <span className="font-semibold text-white">{dashboard.name}</span> and all
                  associated insights. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

// Memoize to prevent unnecessary re-renders
export const DatasetCard = memo(DatasetCardComponent);
