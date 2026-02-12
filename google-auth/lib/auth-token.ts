import jwt from "jsonwebtoken";
import { parse, serialize } from "cookie";
import type { NextApiRequest } from "next";
import type { GoogleUser } from "@/lib/passport";

const cookieName = "auth_token";
const sevenDaysInSeconds = 60 * 60 * 24 * 7;

export function signAuthToken(user: GoogleUser): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("Missing JWT_SECRET in environment.");
  }

  return jwt.sign(user, jwtSecret, { expiresIn: sevenDaysInSeconds });
}

export function readAuthToken(req: NextApiRequest): GoogleUser | null {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("Missing JWT_SECRET in environment.");
  }

  const cookies = parse(req.headers.cookie ?? "");
  const token = cookies[cookieName];

  if (!token) {
    return null;
  }

  const payload = jwt.verify(token, jwtSecret);

  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  return {
    id: String(payload.id ?? ""),
    email: payload.email ? String(payload.email) : null,
    displayName: String(payload.displayName ?? ""),
    picture: payload.picture ? String(payload.picture) : null,
  };
}

export function createAuthCookie(token: string): string {
  return serialize(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sevenDaysInSeconds,
  });
}

export function createLogoutCookie(): string {
  return serialize(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
