"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import { parseDataFile, validateDataStructure, getDataSummary, ParsedData } from "@/lib/file-parser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { DatasetSummary } from "@/types/dashboard";

export default function UploadPage() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<(ParsedData & { summary: DatasetSummary }) | null>(null);
  const [datasetName, setDatasetName] = useState("");
  const [datasetDescription, setDatasetDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = async (res: Array<{ url: string; name: string }>) => {
    if (res && res[0]) {
      const file = res[0];
      setUploadedFile(file);
      setDatasetName(file.name.replace(/\.[^/.]+$/, ""));
      setError(null);
      
      setIsProcessing(true);
      try {
        const fileType = file.name.split(".").pop() || "";
        const data = await parseDataFile(file.url, fileType);
        
        const validation = validateDataStructure(data);
        if (!validation.valid) {
          setError(validation.errors.join(", "));
          setIsProcessing(false);
          return;
        }

        const summary = getDataSummary(data);
        setParsedData({ ...data, summary });
        setIsProcessing(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse file");
        setIsProcessing(false);
      }
    }
  };

  const handleSaveDataset = async () => {
    if (!parsedData || !uploadedFile) return;

    setIsProcessing(true);
    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: datasetName,
          description: datasetDescription,
          fileUrl: uploadedFile.url,
          fileType: uploadedFile.name.split(".").pop(),
          headers: parsedData.headers,
          rows: parsedData.rows,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save dataset");
      }

      const dashboard = await response.json();
      router.push(`/dashboard/datasets/${dashboard.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save dataset");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Data</h1>
        <p className="text-gray-500 mt-2">
          Upload CSV or Excel files to analyze and generate insights
        </p>
      </div>

      {!uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your File</CardTitle>
            <CardDescription>
              Drag and drop or click to upload your data file
            </CardDescription>
            <div className="pt-2">
              <p className="text-sm text-green-500 font-medium">
                📊 Supported: CSV (.csv), Excel (.xlsx, .xls), JSON (.json)
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <UploadDropzone
              endpoint="dataFileUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error: Error) => {
                console.error("Upload error:", error);
                setError(error.message);
              }}
              onBeforeUploadBegin={(files) => {
                console.log("Starting upload:", files);
                return files;
              }}
              onUploadBegin={(name) => {
                console.log("Upload begin:", name);
              }}
            />
            <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-200 font-medium mb-1">
                📄 File Limits:
              </p>
              <ul className="text-sm text-gray-300 list-disc list-inside">
                <li>CSV files (.csv) - up to 4MB</li>
                <li>Excel files (.xlsx, .xls) - up to 8MB</li>
                <li>JSON files (.json) - up to 4MB</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

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

      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 py-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-500" />
              <p className="text-gray-300">Processing your file...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {parsedData && uploadedFile && !isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <span>File Parsed Successfully</span>
            </CardTitle>
            <CardDescription>Review the data and save to your dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Total Rows</p>
                <p className="text-2xl font-bold text-white">{parsedData.totalRows}</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Total Columns</p>
                <p className="text-2xl font-bold text-white">{parsedData.totalColumns}</p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Numeric Columns</p>
                <p className="text-2xl font-bold text-white">
                  {parsedData.summary.numericColumns.length}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Text Columns</p>
                <p className="text-2xl font-bold text-white">
                  {parsedData.summary.textColumns.length}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Columns Detected:</h3>
              <div className="flex flex-wrap gap-2">
                {parsedData.headers.map((header: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm"
                  >
                    {header}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="datasetName">Dataset Name</Label>
                <Input
                  id="datasetName"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="Enter a name for your dataset"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="datasetDescription">Description (Optional)</Label>
                <Input
                  id="datasetDescription"
                  value={datasetDescription}
                  onChange={(e) => setDatasetDescription(e.target.value)}
                  placeholder="Add a description"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleSaveDataset}
                disabled={!datasetName || isProcessing}
                className="flex-1"
              >
                Save Dataset
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setUploadedFile(null);
                  setParsedData(null);
                  setDatasetName("");
                  setDatasetDescription("");
                  setError(null);
                }}
              >
                Upload Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
