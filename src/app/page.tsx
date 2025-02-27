"use client";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const handleStravaLogin = async () => {
    await signIn("strava", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Training & Recovery Dashboard</h1>
      <Button
        onClick={handleStravaLogin}
        className="mb-2"
        disabled={loading || !!session}
      >
        {loading
          ? "Loading..."
          : session
          ? "Connected to Strava"
          : "Connect Strava"}
      </Button>

      {session && (
        <div className="mt-4">
          <p>Welcome, {session.user?.name}!</p>
        </div>
      )}
    </div>
  );
}
