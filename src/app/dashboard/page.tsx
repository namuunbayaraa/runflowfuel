"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import MileageChart from "@/components/MileageChart";
import PageLayout from "@/components/PageLayout";

export default function Dashboard() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <h1 className="text-2xl font-bold mb-8">Training Dashboard</h1>
        <div className="w-full max-w-4xl mx-auto">
          <MileageChart />
        </div>
      </div>
    </PageLayout>
  );
}
