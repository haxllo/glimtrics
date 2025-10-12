import { createUploadthing } from "uploadthing/next";
import type { FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  dataFileUploader: f({
    "text/csv": { maxFileSize: "4MB" },
    "application/json": { maxFileSize: "4MB" },
    "application/vnd.ms-excel": { maxFileSize: "8MB" },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { maxFileSize: "8MB" },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        throw new Error("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
