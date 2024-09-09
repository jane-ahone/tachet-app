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

// Mock database
let tappers = [
  {
    id: 1,
    name: "John Doe",
    contactNumber: "1234567890",
    address: "123 Palm St",
    joiningDate: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    contactNumber: "0987654321",
    address: "456 Coconut Ave",
    joiningDate: "2023-03-22",
  },
];

export default async function handler(req: NextRequest, res: NextResponse) {
  switch (req.method) {
    case "GET":
      // Read all tappers
      try {
        const queryString: string = "SELECT * FROM tapper";
        const result = await query(queryString);
        return NextResponse.json({ tappers: result.rows[0] }, { status: 201 });
      } catch (error) {
        console.log("Database query error:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }

    case "POST":
      // Create a new tapper
      const { name, contactNumber, email, address } = await req.json();

      // Validate input
      if (!name || !contactNumber || !email || !address) {
        return NextResponse.json(
          {
            error: "Username,contactNumber, and email and address are required",
          },
          { status: 400 }
        );
      }

      try {
        const queryString: string =
          "INSERT INTO tappers(tapper_name,phone_number,email,home_address) VALUES($1,$2,$3,$4) RETURNING *";
        const result = await query(queryString, [
          name,
          contactNumber,
          email,
          address,
        ]);

        return NextResponse.json(
          { newTapper: result.rows[0] },
          { status: 201 }
        );
      } catch (error) {
        console.log("Database query error:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }

    default:
      NextResponse.json({ status: 405 });
  }
}
