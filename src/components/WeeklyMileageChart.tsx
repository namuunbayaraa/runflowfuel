"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Run {
  distance: number;
  start_date: string;
}

interface WeeklyMileageChartProps {
  runs: Run[];
}

export default function WeeklyMileageChart({ runs }: WeeklyMileageChartProps) {
  // Group runs by week and sum distances
  const weeklyMileage = runs.reduce((acc: Record<string, number>, run) => {
    const date = new Date(run.start_date);
    // Get Monday of the week (0 = Sunday, so we need to handle that case)
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0); // Reset time part
    const weekKey = monday.toISOString().split("T")[0];

    acc[weekKey] = (acc[weekKey] || 0) + run.distance;
    return acc;
  }, {});

  // Sort weeks chronologically and format data
  const data = Object.entries(weeklyMileage)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, miles]) => ({
      week: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      miles: Number(miles.toFixed(2)),
    }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 50,
            bottom: 65,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="week"
            label={{
              value: "Week Starting",
              position: "bottom",
              offset: 40,
            }}
            tick={{ angle: -45, textAnchor: "end", dy: 8 }}
          />
          <YAxis
            label={{
              value: "Miles",
              angle: -90,
              position: "insideLeft",
              offset: -35,
            }}
          />
          <Tooltip
            formatter={(value: number) => [`${value} miles`, "Weekly Mileage"]}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Line
            type="monotone"
            dataKey="miles"
            name="Weekly Mileage"
            stroke="#4ade80"
            strokeWidth={2}
            dot={{ fill: "#4ade80", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
