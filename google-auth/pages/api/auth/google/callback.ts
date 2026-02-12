import type { NextApiRequest, NextApiResponse } from "next";
import passport from "passport";
import { createAuthCookie, signAuthToken } from "@/lib/auth-token";
import { configurePassport, GoogleUser } from "@/lib/passport";

function authenticateGoogleUser(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<GoogleUser> {
  return new Promise((resolve, reject) => {
    const middleware = passport.authenticate(
      "google",
      { session: false },
      (error: unknown, user: GoogleUser | false) => {
        if (error) {
          reject(error);
          return;
        }

        if (!user) {
          reject(new Error("Google authentication failed."));
          return;
        }

        resolve(user);
      },
    );

    middleware(req, res, (nextError: unknown) => {
      if (nextError) {
        reject(nextError);
      }
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    configurePassport();
    const user = await authenticateGoogleUser(req, res);
    const token = signAuthToken(user);

    res.setHeader("Set-Cookie", createAuthCookie(token));
    res.redirect(302, "/");
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : "Login failed",
    });
  }
}
