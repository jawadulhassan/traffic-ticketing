import { NextRequest, NextResponse } from "next/server";
import { initDatabase, seedDatabase } from "@/lib/database-vercel";

export async function POST(request: NextRequest) {
  try {
    initDatabase();
    await seedDatabase();

    return NextResponse.json({
      message: "Database initialized successfully",
      success: true,
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      {
        error: "Failed to initialize database",
        success: false,
      },
      { status: 500 }
    );
  }
}
