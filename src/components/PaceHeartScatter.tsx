"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Run {
  average_speed: number;
  average_heartrate?: number;
  name: string;
  start_date: string;
  workout_type?: number; // Strava workout type
}

interface PaceHeartScatterProps {
  runs: Run[];
}

interface RunTypeConfig {
  name: string;
  emoji: string;
  color: string;
}

interface RunData {
  name: string;
  date: string;
  pace: number;
  heartRate: number;
}

export default function PaceHeartScatter({ runs }: PaceHeartScatterProps) {
  const runTypes: Record<number, RunTypeConfig> = {
    1: { name: "Race", emoji: "🎯", color: "rgb(239, 68, 68)" }, // red
    2: { name: "Long Run", emoji: "💪", color: "rgb(34, 197, 94)" }, // green
    3: { name: "Workout", emoji: "⚡", color: "rgb(234, 179, 8)" }, // yellow
    0: { name: "Easy Run", emoji: "🏃‍♀️", color: "rgb(99, 102, 241)" }, // blue
  };

  const getRunConfig = (type?: number): RunTypeConfig => {
    return runTypes[type || 0];
  };

  // Group runs by type
  const runsByType = runs
    .filter((run) => run.average_heartrate)
    .reduce((acc, run) => {
      const type = run.workout_type || 0;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        name: run.name,
        date: `${getRunConfig(run.workout_type).emoji} ${new Date(
          run.start_date
        ).toLocaleDateString()}`,
        pace: run.average_speed,
        heartRate: Math.round(run.average_heartrate ?? 0),
      });
      return acc;
    }, {} as Record<number, RunData[]>);

  // Calculate statistics for easy runs
  const easyRuns = runsByType[0] || [];
  const avgHR = easyRuns.length
    ? Math.round(
        easyRuns.reduce((sum, run) => sum + run.heartRate, 0) / easyRuns.length
      )
    : 0;

  const stdDev = easyRuns.length
    ? Math.round(
        Math.sqrt(
          easyRuns.reduce(
            (sum, run) => sum + Math.pow(run.heartRate - avgHR, 2),
            0
          ) / easyRuns.length
        )
      )
    : 0;

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 30,
              left: 50,
              bottom: 65,
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
                offset: 40,
              }}
              domain={[6, "auto"]}
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
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                paddingBottom: "20px",
              }}
            />
            {Object.entries(runsByType).map(([type, data]) => (
              <Scatter
                key={type}
                name={`${runTypes[Number(type)].emoji} ${
                  runTypes[Number(type)].name
                }`}
                data={data}
                fill={runTypes[Number(type)].color}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {easyRuns.length > 0 && (
        <div className="text-sm text-gray-600">
          <p>
            Easy Run Analysis ({easyRuns.length} runs):
            <span className="ml-2 font-medium">
              Average HR: {avgHR} ± {stdDev} bpm
            </span>
            <span className="ml-2">
              (Range: {avgHR - stdDev} - {avgHR + stdDev} bpm)
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
