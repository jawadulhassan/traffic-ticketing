import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/database-json";

export async function POST(request: NextRequest) {
  try {
    const db = getDatabase();
    const {
      eventId,
      userId,
      licensePlateNumber,
      decision,
      issueReason,
      dmvInfo,
    } = await request.json();

    if (!eventId || !userId || !decision) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert annotation record
    const insertAnnotation = db.prepare(`
      INSERT INTO annotations (event_id, user_id, license_plate_number, decision, issue_reason, dmv_make, dmv_model, dmv_color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertAnnotation.run(
      eventId,
      userId,
      licensePlateNumber,
      decision,
      issueReason,
      dmvInfo?.make,
      dmvInfo?.model,
      dmvInfo?.color
    );

    // Mark event as processed
    const updateEvent = db.prepare(
      "UPDATE traffic_events SET is_processed = TRUE WHERE id = ?"
    );
    updateEvent.run(eventId);

    return NextResponse.json({
      message: "Annotation submitted successfully",
      nextEvent: true,
    });
  } catch (error) {
    console.error("Annotation submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
