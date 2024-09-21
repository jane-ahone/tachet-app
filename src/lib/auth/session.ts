import { SessionOptions } from "iron-session";
import { SessionData } from "../types/interface";

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  // You need to create a secret key at least 32 characters long.
  password: process.env.SESSION_SECRET!,
  cookieName: "user-login-session",
  cookieOptions: {
    httpOnly: true,
    maxAge: 60 * 5,
  },
};
