"use server";

import { getSession } from "@/lib/auth/action";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // ADD THE LOGOUT FUNCTION

  const session = await getSession();
  session.destroy();
  redirect("/login");

  return NextResponse.json({ message: "Logged out successfully" });
}
