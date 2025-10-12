"use client";

import { UploadButton, UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";

interface FileUploaderProps {
  onUploadComplete?: (fileUrl: string) => void;
  variant?: "button" | "dropzone";
}

export function FileUploader({ onUploadComplete, variant = "dropzone" }: FileUploaderProps) {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleUploadComplete = (res: Array<{ url: string }>) => {
    if (res && res[0]) {
      const fileUrl = res[0].url;
      setUploadedFile(fileUrl);
      onUploadComplete?.(fileUrl);
      console.log("Files uploaded:", res);
    }
  };

  if (variant === "button") {
    return (
      <div className="space-y-4">
        <UploadButton<OurFileRouter, "dataFileUploader">
          endpoint="dataFileUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error: Error) => {
            alert(`Upload error: ${error.message}`);
          }}
          appearance={{
            button: "bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition",
            container: "w-full",
          }}
        />
        {uploadedFile && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              File uploaded successfully!
            </p>
            <a 
              href={uploadedFile} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:underline"
            >
              View file
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <UploadDropzone<OurFileRouter, "dataFileUploader">
        endpoint="dataFileUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => {
          alert(`Upload error: ${error.message}`);
        }}
        appearance={{
          container: "border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-indigo-500 transition",
          uploadIcon: "text-indigo-600",
          label: "text-gray-700",
          allowedContent: "text-gray-500 text-sm",
        }}
      />
      {uploadedFile && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium mb-1">
            File uploaded successfully!
          </p>
          <a 
            href={uploadedFile} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline"
          >
            View file
          </a>
        </div>
      )}
    </div>
  );
}
