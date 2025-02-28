"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Run {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  start_date: string;
  average_speed: number;
}

export default function RunsList() {
  const { data: session } = useSession();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const response = await fetch("/api/activities");
        if (!response.ok) {
          throw new Error("Failed to fetch runs");
        }
        const data = await response.json();
        setRuns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch runs");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchRuns();
    }
  }, [session]);

  if (!session) {
    return <div>Please log in to see your runs</div>;
  }

  if (loading) {
    return <div>Loading runs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recent Runs</h2>
      <div className="grid gap-4">
        {runs.map((run) => (
          <div
            key={run.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold">{run.name}</h3>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>Distance: {(run.distance / 1000).toFixed(2)} km</div>
              <div>
                Time: {Math.floor(run.moving_time / 60)}:
                {String(run.moving_time % 60).padStart(2, "0")}
              </div>
              <div>
                Pace:{" "}
                {(run.moving_time / 60 / (run.distance / 1000)).toFixed(2)}{" "}
                min/km
              </div>
              <div>Date: {new Date(run.start_date).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
