import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/database-json";

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    // Get a random unprocessed event
    const event = db
      .prepare(
        `
      SELECT * FROM traffic_events 
      WHERE is_processed = FALSE 
      ORDER BY RANDOM() 
      LIMIT 1
    `
      )
      .get() as any;

    if (!event) {
      return NextResponse.json(
        {
          error: "No more events to process",
          message:
            "All events have been processed. Please reset the database to continue.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      event: {
        id: event.id,
        video_url: event.video_url,
        license_plate_image_url: event.license_plate_image_url,
        event_type: event.event_type,
        location: event.location,
        timestamp: event.timestamp,
      },
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
