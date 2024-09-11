import { NextResponse, NextRequest } from "next/server";
import { query } from "@/lib/db/db"; // Assuming you have a db utility

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // Check if the customer exists
    const checkResult = await query(
      "SELECT * FROM customer WHERE customer_id = $1",
      [id]
    );

    if (checkResult.rowCount === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Proceed with deletion
    const deleteResult = await query(
      "DELETE FROM customer WHERE customer_id = $1",
      [id]
    );

    deleteResult.rowCount == null ? (deleteResult.rowCount = 0) : null;

    if (deleteResult.rowCount > 0) {
      return NextResponse.json(
        { message: "Customer deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to delete customer" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
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
    const { customer_name, phone_number, email, home_address } =
      await request.json();

    // Validate input
    if (!customer_name || !phone_number || !email || !home_address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update customer in the database
    const result = await query(
      `UPDATE customer 
       SET name = $1, contact_number = $2, address = $3,
       WHERE customer_id = $4
       RETURNING *`,
      [customer_name, phone_number, home_address, id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
