# UploadThing Setup Guide

This project uses UploadThing for file uploads with the free tier, which is sufficient for MVP.

## Setup Steps

### 1. Create an UploadThing Account

1. Go to [https://uploadthing.com](https://uploadthing.com)
2. Sign up with GitHub, Google, or email
3. Verify your email if required

### 2. Create a New App

1. Click "Create App" in the UploadThing dashboard
2. Give your app a name (e.g., "AI Dashboards SaaS")
3. Select the free tier

### 3. Get Your API Keys

1. In your app dashboard, navigate to "API Keys"
2. Copy your:
   - **App ID** (UPLOADTHING_APP_ID)
   - **Secret Key** (UPLOADTHING_SECRET)

### 4. Add Keys to Environment

Add these to your `.env` file:

```env
UPLOADTHING_SECRET="your-secret-key-here"
UPLOADTHING_APP_ID="your-app-id-here"
```

## Usage in the App

### File Router Configuration

The file router is configured in `app/api/uploadthing/core.ts` with three endpoints:

1. **csvUploader** - CSV files only (max 4MB)
2. **excelUploader** - Excel files only (max 8MB)
3. **dataFileUploader** - CSV, Excel, and JSON (mixed upload)

### Upload Components

Use the `FileUploader` component in your pages:

```tsx
import { FileUploader } from "@/components/upload/FileUploader";

export default function MyPage() {
  return (
    <FileUploader 
      variant="dropzone" // or "button"
      onUploadComplete={(fileUrl) => {
        console.log("Uploaded file URL:", fileUrl);
      }}
    />
  );
}
```

### Example Pages

- `/dashboard/upload` - Full upload example with both variants

## Free Tier Limits

- **Storage**: 2GB
- **Bandwidth**: 2GB/month
- **File Size**: Up to 16MB per file
- **Rate Limit**: 30 requests per minute

Perfect for MVP and early development!

## File Processing

After upload, use the file parser utilities:

```typescript
import { parseDataFile, validateDataStructure, getDataSummary } from "@/lib/file-parser";

const data = await parseDataFile(fileUrl, fileType);
const validation = validateDataStructure(data);
const summary = getDataSummary(data);
```

## Security

- Middleware authentication is configured but currently uses a placeholder user ID
- Update `app/api/uploadthing/core.ts` middleware to integrate with NextAuth:

```typescript
.middleware(async ({ req }) => {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new UploadThingError("Unauthorized");
  return { userId: session.user.id };
})
```

## Customization

### Allowed File Types

Edit `app/api/uploadthing/core.ts` to modify accepted file types:

```typescript
f({ 
  "text/csv": { maxFileSize: "4MB" },
  "application/pdf": { maxFileSize: "2MB" },
  // Add more types...
})
```

### Styling

Customize upload components in `components/upload/FileUploader.tsx` using the `appearance` prop.

## Troubleshooting

### Upload Not Working
- Check that your API keys are correctly set in `.env`
- Verify your app is active in UploadThing dashboard
- Check browser console for errors

### File Size Errors
- Ensure file is within configured limits
- Free tier supports up to 16MB per file

### CORS Errors
- UploadThing handles CORS automatically
- If issues persist, check your deployment settings

## Additional Resources

- [UploadThing Docs](https://docs.uploadthing.com)
- [React Component API](https://docs.uploadthing.com/api-reference/react)
- [File Router Configuration](https://docs.uploadthing.com/api-reference/server)
