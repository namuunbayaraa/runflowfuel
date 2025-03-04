import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if token needs refresh
    if (session.expiresAt && session.expiresAt < Date.now() / 1000) {
      // Token expired, return error
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    const response = await fetch(
      "https://www.strava.com/api/v3/athlete/activities?per_page=30",
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

    const activities = await response.json();
    
    // Filter for runs only and convert metrics
    const runs = activities
      .filter((activity: any) => activity.type === "Run")
      .map((run: any) => ({
        ...run,
        distance: run.distance * 0.000621371, // Convert to miles
        average_speed: 26.8224 / run.average_speed // Convert to min/mile pace
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