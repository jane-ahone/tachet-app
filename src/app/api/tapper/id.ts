import { query } from "@/lib/db/db";
import { NextRequest, NextResponse } from "next/server";

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
  const { id, name, contactNumber, email, address } = await req.json();
  const tapperId = parseInt(id as string);

  switch (req.method) {
    case "PUT":
      // Update a tapper
      try {
        const queryString = "UPDATE tappers";
      } catch (error) {}

      break;
    case "DELETE":
      // Delete a tapper
      try {
        const queryString = "DELETE * WHERE tapper_id= $1";
        const result = await query(queryString, [id]);
        return NextResponse.json(
          { message: "Deleted tapper entry sucessfully" },
          { status: 201 }
        );
      } catch (error) {}

    default:
      // res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      // res.status(405).end(`Method ${req.method} Not Allowed`);
      return NextResponse.json({ status: 405 });
  }
}
