"use server";

import { redirect } from "next/navigation";
import { getSession } from "../auth/action";
import { SessionData } from "../types/interface";

export const fetchSessionData = async () => {
  const sessionData = await getSession(); // Await the promise to resolve

  if (sessionData.isLoggedIn) {
    const User: SessionData = {
      userId: sessionData.userId,
      username: sessionData.username,
      email: sessionData.email,
      isLoggedIn: sessionData.isLoggedIn,
    };
    return User;
  } else {
    redirect("/");
  }
};
