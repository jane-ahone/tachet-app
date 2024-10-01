// pages/api/orders/index.js
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/db";

export async function GET(req: NextRequest) {
  // Reading all orders
  try {
    const queryString: string = "SELECT * FROM orders";
    const result = await query(queryString);
    return NextResponse.json({ orders: result.rows }, { status: 201 });
  } catch (error) {
    console.log("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Create a new order
  const body = await req.json();

  const { customer_id, order_qty, order_date, status } = body;

  // Validate input
  if (!customer_id || !order_qty || !order_date || !status) {
    return NextResponse.json(
      {
        error: "Customer id,order_qty, order_date and status are required",
      },
      { status: 400 }
    );
  }

  try {
    const queryString: string =
      "INSERT INTO orders(customer_id,order_qty,order_date,status) VALUES($1,$2,$3,$4) RETURNING *";
    const result = await query(queryString, [
      customer_id,
      order_qty,
      order_date,
      status,
    ]);

    return NextResponse.json({ orders: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.log("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
