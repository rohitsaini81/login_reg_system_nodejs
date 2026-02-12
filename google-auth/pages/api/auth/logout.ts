import type { NextApiRequest, NextApiResponse } from "next";
import { createLogoutCookie } from "@/lib/auth-token";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.setHeader("Set-Cookie", createLogoutCookie());
  res.status(200).json({ message: "Logged out" });
}
