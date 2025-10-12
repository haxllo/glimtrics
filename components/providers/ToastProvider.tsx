"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "hsl(0 0% 7%)",
          color: "white",
          border: "1px solid hsl(0 0% 20%)",
        },
      }}
    />
  );
}
