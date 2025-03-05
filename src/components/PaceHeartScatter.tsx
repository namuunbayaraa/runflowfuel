"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Run {
  average_speed: number;
  average_heartrate?: number;
  name: string;
  start_date: string;
}

interface PaceHeartScatterProps {
  runs: Run[];
}

export default function PaceHeartScatter({ runs }: PaceHeartScatterProps) {
  const data = runs
    .filter((run) => run.average_heartrate) // Only include runs with heart rate data
    .map((run) => ({
      name: run.name,
      date: new Date(run.start_date).toLocaleDateString(),
      pace: run.average_speed, // Already in min/mile format
      heartRate: Math.round(run.average_heartrate),
    }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 30,
            left: 50,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3" />
          <XAxis
            type="number"
            dataKey="pace"
            name="Pace"
            label={{
              value: "Pace (min/mile)",
              position: "bottom",
            }}
            domain={["auto", "auto"]}
          />
          <YAxis
            type="number"
            dataKey="heartRate"
            name="Heart Rate"
            label={{
              value: "Heart Rate (bpm)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p className="font-semibold">{data.name}</p>
                    <p>Date: {data.date}</p>
                    <p>
                      Pace: {Math.floor(data.pace)}:
                      {String(Math.round((data.pace % 1) * 60)).padStart(
                        2,
                        "0"
                      )}
                      /mi
                    </p>
                    <p>Heart Rate: {data.heartRate} bpm</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Runs" data={data} fill="rgb(136, 132, 216)" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
