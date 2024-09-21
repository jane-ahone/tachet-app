"use server";

import { defaultSession, sessionOptions } from "./session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData } from "../types/interface";

// ADD THE GETSESSION ACTION
export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  // If user visits for the first time session returns an empty object.
  // Let's add the isLoggedIn property to this object and its value will be the default value which is false
  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
}
