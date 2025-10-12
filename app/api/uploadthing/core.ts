import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  csvUploader: f({ 
    "text/csv": { maxFileSize: "4MB", maxFileCount: 1 },
    "application/vnd.ms-excel": { maxFileSize: "4MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "4MB", maxFileCount: 1 }
  })
    .middleware(async () => {
      return { userId: "user_123" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),

  excelUploader: f({ 
    "application/vnd.ms-excel": { maxFileSize: "8MB", maxFileCount: 1 },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "8MB", maxFileCount: 1 }
  })
    .middleware(async () => {
      return { userId: "user_123" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),

  dataFileUploader: f({ 
    "text/csv": { maxFileSize: "4MB" },
    "application/json": { maxFileSize: "4MB" },
    "application/vnd.ms-excel": { maxFileSize: "8MB" },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "8MB" }
  })
    .middleware(async () => {
      return { userId: "user_123" };
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Data file upload complete");
      console.log("File URL:", file.url);
      return { success: true, fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
