"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PageLayout from "@/components/PageLayout";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <Button
          onClick={() => signIn("strava", { callbackUrl: "/dashboard" })}
          className="mb-2"
          disabled={loading}
        >
          {loading ? "Loading..." : "Connect with Strava"}
        </Button>
      </div>
    </PageLayout>
  );
}
