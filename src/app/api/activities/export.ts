import { NextResponse } from "next/server";
import { Parser } from "json2csv";
import { GET as getStravaActivities } from "./route";

export async function GET(request: Request) {
  try {
    // Call existing function to fetch Strava activities
    const response = await getStravaActivities(request);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch activities" },
        { status: 500 }
      );
    }

    const activities = await response.json();

    if (!activities || activities.length === 0) {
      return NextResponse.json(
        { error: "No activities found" },
        { status: 404 }
      );
    }

    // Define CSV fields
    const fields = [
      "name",
      "distance",
      "moving_time",
      "elapsed_time",
      "total_elevation_gain",
      "average_speed",
      "start_date_local",
      "workout_type",
    ];
    const json2csvParser = new Parser({ fields });

    // Convert activities to CSV format
    const csv = json2csvParser.parse(activities);

    // Return CSV response
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=strava_activities.csv",
      },
    });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    return NextResponse.json(
      { error: "Failed to export activities" },
      { status: 500 }
    );
  }
}
