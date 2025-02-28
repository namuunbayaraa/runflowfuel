import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      "https://www.strava.com/api/v3/athlete/activities?per_page=30",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.statusText}`);
    }

    const activities = await response.json();
    
    // Filter for runs only
    const runs = activities.filter(
      (activity: any) => activity.type === "Run"
    );

    return NextResponse.json(runs);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
} 