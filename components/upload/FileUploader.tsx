"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
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
        <UploadButton
          endpoint="dataFileUploader"
          onClientUploadComplete={handleUploadComplete}
          onUploadError={(error: Error) => {
            alert(`Upload error: ${error.message}`);
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
              className="text-sm text-green-500 hover:underline"
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
      <UploadDropzone
        endpoint="dataFileUploader"
        onClientUploadComplete={handleUploadComplete}
        onUploadError={(error: Error) => {
          alert(`Upload error: ${error.message}`);
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
            className="text-sm text-green-500 hover:underline"
          >
            View file
          </a>
        </div>
      )}
    </div>
  );
}
