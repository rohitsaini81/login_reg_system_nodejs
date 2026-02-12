import type { NextApiRequest, NextApiResponse } from "next";
import { readAuthToken } from "@/lib/auth-token";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const user = readAuthToken(req);
    res.status(200).json({
      authenticated: Boolean(user),
      user,
    });
  } catch (error) {
    res.status(500).json({
      authenticated: false,
      error: error instanceof Error ? error.message : "Auth check failed",
    });
  }
}
