import { query } from "@/lib/db/db";
import { NextRequest, NextResponse } from "next/server";
const bcrypt = require("bcrypt");
const saltRounds = 10;

type User = {
  name: string;
  email: string;
};

type Data = {
  message: string;
  data?: User;
};

async function hashPassword(plainTextPassword: string): Promise<{
  hashedPassword?: string | null;
  salt?: string | null;
  error?: string;
}> {
  try {
    const salt: string = await bcrypt.genSalt(saltRounds);
    const hashedPassword: string = await bcrypt.hash(plainTextPassword, salt);
    console.log("Hashed Password:", hashedPassword, "and salt:", salt);
    return { hashedPassword, salt };
  } catch (err) {
    console.error("Error hashing password:", err);
    return { error: "Internal Server Error" };
  }
}

export async function POST(request: NextRequest) {
  const { username, password, email } = await request.json();

  // Validate input
  if (!username || !password || !email) {
    return NextResponse.json(
      { error: "Username, password, and email are required" },
      { status: 400 }
    );
  }

  //Valid email

  //password hashing; Authentication
  const { hashedPassword, salt, error } = await hashPassword(password);
  if (error || !hashedPassword || !salt) {
    return NextResponse.json(
      { error: error || "Failed to hash password" },
      { status: 500 }
    );
  }

  //Session ID; Authorisation

  //SQL query
  const created_at = new Date().toISOString();
  const queryString: string =
    "INSERT INTO users(username,password,email,created_at,salt) VALUES($1,$2,$3,$4,$5) RETURNING *";
  try {
    const result = await query(queryString, [
      username,
      hashedPassword,
      email,
      created_at,
      salt,
    ]);

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.log("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
