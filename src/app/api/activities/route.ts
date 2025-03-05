import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  start_date: string;
  average_speed: number;
  average_heartrate?: number;
  workout_type?: number;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const after = searchParams.get('after');
  const before = searchParams.get('before');

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const params = new URLSearchParams({
      per_page: "200",
      ...(after && { after: Math.floor(new Date(after).getTime() / 1000).toString() }),
      ...(before && { before: Math.floor(new Date(before).getTime() / 1000).toString() }),
    });

    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?${params}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (response.status === 401) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.statusText}`);
    }

    const activities: StravaActivity[] = await response.json();
    
    const runs = activities
      .filter((activity) => activity.type === "Run")
      .map((run) => ({
        ...run,
        distance: run.distance * 0.000621371,
        average_speed: 26.8224 / run.average_speed,
        workout_type: run.workout_type,
      }));

    return NextResponse.json(runs);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
} 