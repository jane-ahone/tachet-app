// pages/api/customers/index.js
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/db";

export async function GET(req: NextRequest) {
  // Read all customers
  try {
    const queryString: string = "SELECT * FROM customer";
    const result = await query(queryString);
    console.log(result.rows);
    return NextResponse.json({ customers: result.rows }, { status: 201 });
  } catch (error) {
    console.log("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  console.log("I have been hit:Post");
  // Create a new customer
  const { customer_name, phone_number, email, home_address } = await req.json();

  // Validate input
  if (!customer_name || !phone_number || !email || !home_address) {
    return NextResponse.json(
      {
        error:
          "Customer name,phone number, email and home address are required",
      },
      { status: 400 }
    );
  }

  try {
    const queryString: string =
      "INSERT INTO customer(customer_name,phone_number,email,home_address) VALUES($1,$2,$3,$4) RETURNING *";
    const result = await query(queryString, [
      customer_name,
      phone_number,
      email,
      home_address,
    ]);

    return NextResponse.json({ customers: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.log("Database query error:", error);
    return NextResponse.json(
      { error: `Internal Server Error ${error}` },
      { status: 500 }
    );
  }
}
