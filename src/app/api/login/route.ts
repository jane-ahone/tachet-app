import { getSession } from "@/lib/auth/action";
import { query } from "@/lib/db/db";
const bcrypt = require("bcrypt");
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const fieldSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be under 100 charcters"),
});

export async function POST(request: NextRequest) {
  const formData = await request.json();
  const resultValidation = fieldSchema.safeParse(formData);

  if (resultValidation.success) {
    const { email, password } = formData;

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

        return NextResponse.json(
          {
            user: user,
            message: "Logged in successfully",
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            message: "Invalid credentials",
          },
          { status: 401 }
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: "Error during login",
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }
  } else {
    let newErrors: Record<string, string> = {};
    resultValidation.error.errors.map((error) => {
      const fieldName = error.path[0];
      const errorMsg = error.message;
      newErrors[fieldName] = errorMsg;
    });
    return NextResponse.json(
      {
        message: "Bad Request",
        errors: newErrors,
      },
      { status: 400 }
    );
  }
}
