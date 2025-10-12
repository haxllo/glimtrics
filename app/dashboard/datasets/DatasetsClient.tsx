"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === dashboards.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(dashboards.map(d => d.id));
    }
  };

  const handleBulkDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch("/api/dashboard/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete datasets");
      }

      const data = await response.json();
      toast.success(data.message);
      setSelectedIds([]);
      setShowDeleteDialog(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete datasets");
    } finally {
      setIsDeleting(false);
    }
  };

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
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {dashboards.length > 1 && (
        <div className="flex items-center justify-between bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={selectedIds.length === dashboards.length}
              onCheckedChange={toggleSelectAll}
              className="border-gray-700"
            />
            <span className="text-sm text-gray-400">
              {selectedIds.length === 0
                ? "Select datasets"
                : `${selectedIds.length} selected`}
            </span>
          </div>
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {selectedIds.length} dataset{selectedIds.length > 1 ? "s" : ""}
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((dashboard) => (
          <div key={dashboard.id} className="relative">
            {dashboards.length > 1 && (
              <div className="absolute top-4 right-4 z-10">
                <Checkbox
                  checked={selectedIds.includes(dashboard.id)}
                  onCheckedChange={() => toggleSelection(dashboard.id)}
                  className="border-gray-700 bg-gray-900/80"
                />
              </div>
            )}
            <DatasetCard dashboard={dashboard} />
          </div>
        ))}
      </div>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete {selectedIds.length} Dataset{selectedIds.length > 1 ? "s" : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This will permanently delete the selected dataset{selectedIds.length > 1 ? "s" : ""} and all
              associated insights. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
