import { query } from "@/lib/db/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
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
const fieldSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be under 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be under 100 charcters"),
});

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
  // const { username, password, email } = await request.json();

  try {
    const validatedData = fieldSchema.parse(request.body);

    const { username, password, email } = validatedData;
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      NextResponse.json({ status: 400, errors: error.errors });
    } else {
      NextResponse.json({ status: 500, message: "Internal server error" });
    }
  }
}
