import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/db";

export async function GET(req: NextRequest) {
  // Read all tappers
  try {
    const queryString: string = "SELECT * FROM palwine"; //Do a JOIN
    const result = await query(queryString);
    return NextResponse.json({ production: result.rows }, { status: 201 });
  } catch (error) {
    console.log("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
