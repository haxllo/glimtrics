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
      console.log("[UploadThing] Middleware called");
      const session = await getServerSession(authOptions);
      console.log("[UploadThing] Session:", session?.user?.email);
      
      if (!session?.user?.id) {
        console.error("[UploadThing] Unauthorized - no session");
        throw new Error("Unauthorized");
      }

      console.log("[UploadThing] Authorized userId:", session.user.id);
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] Upload complete for userId:", metadata.userId);
      console.log("[UploadThing] File url:", file.url);
      
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
