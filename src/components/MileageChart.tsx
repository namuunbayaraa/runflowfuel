"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DateRangePicker from "./DateRangePicker";
import WeeklyMileageChart from "./WeeklyMileageChart";
import { addMonths, startOfDay, endOfDay } from "date-fns";

interface Run {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  start_date: string;
  average_speed: number;
}

export default function MileageChart() {
  const { data: session } = useSession();
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    from: startOfDay(addMonths(new Date(), -3)), // Default to last 3 months
    to: endOfDay(new Date()),
  });

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          after: dateRange.from.toISOString(),
          before: dateRange.to.toISOString(),
        });

        const response = await fetch(`/api/activities?${params}`);
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
  }, [session, dateRange]);

  if (!session) {
    return <div>Please log in to see your running data</div>;
  }

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      {runs.length > 0 ? (
        <div className="p-4 bg-white rounded-lg shadow">
          <WeeklyMileageChart runs={runs} />
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No runs found for the selected date range
        </div>
      )}
    </div>
  );
}
