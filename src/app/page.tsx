"use client";

import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Training & Recovery Dashboard</h1>
      <Button
        onClick={() => signIn("strava", { callbackUrl: "/dashboard" })}
        className="mb-2"
        disabled={loading}
      >
        {loading ? "Loading..." : "Connect with Strava"}
      </Button>
    </div>
  );
}
