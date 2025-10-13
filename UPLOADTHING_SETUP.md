# UploadThing Setup Guide (v7+ SDK)

This project uses UploadThing v7+ SDK for file uploads with the free tier, which is sufficient for MVP.

## Setup Steps

### 1. Create an UploadThing Account

1. Go to [https://uploadthing.com](https://uploadthing.com)
2. Sign up with GitHub, Google, or email
3. Verify your email if required

### 2. Create a New App

1. Click "Create App" in the UploadThing dashboard
2. Give your app a name (e.g., "Glimtrics")
3. Select the free tier

### 3. Get Your API Token

1. In your app dashboard, navigate to "API Keys"
2. Copy your **UploadThing Token** (starts with `sk_live_` or `sk_test_`)

### 4. Add Token to Environment

Add this to your `.env` file:

```env
UPLOADTHING_TOKEN="your-uploadthing-token-here"
```

## Usage in the App

### File Router Configuration

The file router is configured in `app/api/uploadthing/core.ts` with one endpoint:

- **dataFileUploader** - CSV, Excel, and JSON files (CSV/JSON: max 4MB, Excel: max 8MB)

### Upload Components (v7+ SDK)

The project uses the v7+ SDK with generated components. Use the `FileUploader` wrapper component:

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

Or use the generated components directly:

```tsx
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

export default function MyPage() {
  return (
    <UploadDropzone
      endpoint="dataFileUploader"
      onClientUploadComplete={(res) => {
        console.log("Files:", res);
      }}
      onUploadError={(error) => {
        alert(`Error: ${error.message}`);
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

## Security (v7+ SDK)

✅ **Authentication is already configured!** The middleware checks for valid NextAuth sessions:

```typescript
.middleware(async ({ req }) => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

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

### Styling (v7+ SDK)

For v7+, use the default styling or create a `uploadthing.css` file. The generated components use UploadThing's default styles which can be customized via CSS classes.

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
