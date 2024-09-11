// app/api/tappers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/db";

export async function DELETE({ params }: { params: { id: string } }) {
  const id = params.id;

  try {
    // First, check if the tapper exists
    const queryString = `
      SELECT * FROM tapper WHERE tapper_id = ${id}
    `;
    const checkResult = await query(queryString);

    if (checkResult.rowCount === 0) {
      return NextResponse.json({ error: "Tapper not found" }, { status: 404 });
    }

    const queryStringDelete = ` DELETE FROM tapper WHERE tapper_id = ${id}`;

    // If tapper exists, proceed with deletion
    const result = await query(queryStringDelete);
    console.log(result);

    // if (result.rowCount > 0) {
    //   return NextResponse.json(
    //     { message: "Tapper deleted successfully" },
    //     { status: 200 }
    //   );
    // } else {
    //   return NextResponse.json(
    //     { error: "Failed to delete tapper" },
    //     { status: 500 }
    //   );
    // }
  } catch (error) {
    console.error("Error deleting tapper:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
