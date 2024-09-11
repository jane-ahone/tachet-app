// pages/api/tappers/index.js
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db/db";

type Tapper = {
  tapper_id: number;
  tapper_name: string;
  phone_number: number;
  email: string;
  home_address: string;
};

export async function GET(req: NextRequest) {
  // Read all tappers
  try {
    const queryString: string = "SELECT * FROM tapper";
    const result = await query(queryString);
    return NextResponse.json({ tappers: result.rows }, { status: 201 });
  } catch (error) {
    console.log("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  // Create a new tapper
  const { tapper_name, phone_number, email, home_address } = await req.json();

  // Validate input
  if (!tapper_name || !phone_number || !email || !home_address) {
    return NextResponse.json(
      {
        error: "Username,contactNumber, and email and address are required",
      },
      { status: 400 }
    );
  }

  try {
    const queryString: string =
      "INSERT INTO tapper(tapper_name,phone_number,email,home_address) VALUES($1,$2,$3,$4) RETURNING *";
    const result = await query(queryString, [
      tapper_name,
      phone_number,
      email,
      home_address,
    ]);

    return NextResponse.json({ newTapper: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.log("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
