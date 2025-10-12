import { FileUploader } from "@/components/upload/FileUploader";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Your Data
          </h1>
          <p className="text-gray-600 mb-8">
            Upload CSV or Excel files to generate AI-powered insights
          </p>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Drag & Drop Upload
              </h2>
              <FileUploader variant="dropzone" />
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Button Upload
              </h2>
              <FileUploader variant="button" />
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Supported File Types:
            </h3>
            <ul className="text-sm text-blue-800 list-disc list-inside">
              <li>CSV files (.csv) - up to 4MB</li>
              <li>Excel files (.xls, .xlsx) - up to 8MB</li>
              <li>JSON files (.json) - up to 4MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
