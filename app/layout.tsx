import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/layout/SessionProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import GradientBackdrop from "@/components/ui/GradientBackdrop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Glimtrics",
  description: "AI-powered analytics dashboard for small businesses and creators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GradientBackdrop />
        <div className="relative z-10 min-h-screen overflow-hidden text-white">
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <SessionProvider>
            <ToastProvider />
            <div className="relative z-10 min-h-screen">
              {children}
            </div>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
