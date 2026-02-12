import type { NextApiRequest, NextApiResponse } from "next";
import passport from "passport";
import { configurePassport } from "@/lib/passport";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    configurePassport();
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Auth setup failed",
    });
    return;
  }

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res);
}
