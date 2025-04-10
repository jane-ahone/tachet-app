import { NextResponse, NextRequest } from "next/server";
import { query } from "@/lib/db/db"; // Assuming you have a db utility

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // Check if the tapper exists
    const checkResult = await query(
      "SELECT * FROM tapper WHERE tapper_id = $1",
      [id]
    );

    if (checkResult.rowCount === 0) {
      return NextResponse.json({ error: "Tapper not found" }, { status: 404 });
    }

    // Proceed with deletion
    const deleteResult = await query(
      "DELETE FROM tapper WHERE tapper_id = $1",
      [id]
    );

    deleteResult.rowCount == null ? (deleteResult.rowCount = 0) : null;

    if (deleteResult.rowCount > 0) {
      return NextResponse.json(
        { message: "Tapper deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to delete tapper" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting tapper:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const { tapper_name, phone_number, home_address } = await request.json();

    // Validate input
    if (!tapper_name || !phone_number || !home_address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update tapper in the database
    const result = await query(
      `UPDATE tapper 
       SET name = $1, contact_number = $2, address = $3,
       WHERE tapper_id = $4
       RETURNING *`,
      [tapper_name, phone_number, home_address, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Tapper not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating tapper:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
