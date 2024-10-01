import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/db";

export async function GET(req: NextRequest) {
  // Reading all orders
  try {
    const queryString: string =
      "SELECT order_id,orders.customer_id,order_qty,order_date,status,customer_name FROM orders,customer WHERE orders.customer_id = customer.customer_id";
    const result = await query(queryString);
    return NextResponse.json({ orders: result.rows }, { status: 201 });
  } catch (error) {
    console.log("Database query error:", error);
    return NextResponse.json(
      { error: `Internal Server Error:${error}` },
      { status: 500 }
    );
  }
}
