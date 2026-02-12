import passport from "passport";
import { Profile, Strategy as GoogleStrategy } from "passport-google-oauth20";

export type GoogleUser = {
  id: string;
  email: string | null;
  displayName: string;
  picture: string | null;
};

const strategyName = "google";

function strategyExists(name: string): boolean {
  const passportWithInternals = passport as unknown as {
    _strategy?: (strategy: string) => unknown;
  };

  return Boolean(passportWithInternals._strategy?.(name));
}

export function configurePassport(): void {
  if (strategyExists(strategyName)) {
    return;
  }

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
    process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    throw new Error(
      "Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_CALLBACK_URL in environment.",
    );
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done,
      ) => {
        const primaryEmail = profile.emails?.[0]?.value ?? null;
        const photo = profile.photos?.[0]?.value ?? null;

        done(null, {
          id: profile.id,
          email: primaryEmail,
          displayName: profile.displayName,
          picture: photo,
        } satisfies GoogleUser);
      },
    ),
  );
}
