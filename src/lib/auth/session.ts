import { SessionOptions } from "iron-session";

export interface SessionData {
  userId?: number;
  username?: string;
  email?: string;
  isLoggedIn: boolean;
}

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
