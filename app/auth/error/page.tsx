"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: { [key: string]: string } = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link is invalid or has expired.",
    Default: "An error occurred during authentication.",
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-red-600">Authentication Error</CardTitle>
        <CardDescription>Something went wrong during sign in</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400">{errorMessage}</p>
      </CardContent>
      <CardFooter>
        <Link href="/auth/login" className="w-full">
          <Button className="w-full">Back to Sign In</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black gradient-noise px-4">
      <Suspense fallback={
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <p>Loading...</p>
          </CardContent>
        </Card>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
