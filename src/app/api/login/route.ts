import { getSession } from "@/lib/auth/action";
import { query } from "@/lib/db/db";
import { redirect } from "next/navigation";
const bcrypt = require("bcrypt");
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, res: NextResponse) {
  //POST request confirmation
  if (request.method === "POST") {
    const { email, password } = await request.json();

    //Fetch from db
    try {
      const result = await query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      const user = result.rows[0];

      //password comparison and session generation
      if (user && (await bcrypt.compare(password, user.password))) {
        const session = await getSession();
        session.isLoggedIn = true;
        session.userId = user.id;
        session.username = user.username;
        session.email = user.email;

        await session.save();

        return NextResponse.json({
          message: "Logged in successfully",
          status: "201",
        });
      } else {
        return NextResponse.json({
          message: "Invalid credentials",
          status: "401",
        });
      }
    } catch (error) {
      return NextResponse.json({
        message: "Error during login",
        status: "500",
      });
    }
  } else {
    return NextResponse.json({ message: "Method not allowed", status: "405" });
  }
}
