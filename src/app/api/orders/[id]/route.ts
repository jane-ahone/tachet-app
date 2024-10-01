import { NextResponse, NextRequest } from "next/server";
import { query } from "@/lib/db/db"; // Assuming you have a db utility

const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const MESSAGES = {
  DELETED: "Customer deleted successfully",
  NOT_FOUND: "Customer not found",
  ERROR: "Internal server error",
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const deleteResult = await query("DELETE FROM orders WHERE order_id = $1", [
      id,
    ]);

    deleteResult.rowCount == null ? (deleteResult.rowCount = 0) : null;

    if (deleteResult.rowCount > 0) {
      return NextResponse.json(
        { message: "Order deleted successfully" },
        { status: HTTP_STATUS.OK }
      );
    } else {
      return NextResponse.json(
        { message: "Failed to delete order" },
        { status: HTTP_STATUS.NOT_FOUND }
      );
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
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
