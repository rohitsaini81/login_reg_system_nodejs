# Google Auth with Next.js + Passport.js

A Next.js project that implements Google login using Passport.js and cookie-based JWT authentication.

## Features

- Google OAuth 2.0 login with Passport strategy
- Server-side callback handling and JWT issuance
- HTTP-only auth cookie for session state
- Simple authenticated user endpoint
- Logout endpoint to clear auth cookie

## Tech Stack

- Next.js (App Router + API Routes)
- React + TypeScript
- Passport.js + `passport-google-oauth20`
- `jsonwebtoken` + `cookie`

## Project Structure

```text
google-auth/
├── app/page.tsx                          # Login UI + current user display
├── lib/passport.ts                       # Google strategy configuration
├── lib/auth-token.ts                     # JWT sign/verify + cookie helpers
├── pages/api/auth/google.ts              # Starts Google OAuth flow
├── pages/api/auth/google/callback.ts     # Handles OAuth callback, sets cookie
├── pages/api/auth/me.ts                  # Returns auth status + user
├── pages/api/auth/logout.ts              # Clears auth cookie
└── .env.example                          # Required environment variables
```

## Prerequisites

- Node.js 20+ (LTS recommended)
- A Google Cloud project with OAuth credentials

## Environment Variables

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | Yes | OAuth Client ID from Google Cloud |
| `GOOGLE_CLIENT_SECRET` | Yes | OAuth Client Secret from Google Cloud |
| `GOOGLE_CALLBACK_URL` | Yes | OAuth callback URL used by Passport |
| `JWT_SECRET` | Yes | Secret for signing auth JWT cookie |

Local development callback URL:

```text
http://localhost:3000/api/auth/google/callback
```

## Google Cloud OAuth Setup

1. Open Google Cloud Console.
2. Go to `APIs & Services` -> `OAuth consent screen` and configure the app.
3. Go to `APIs & Services` -> `Credentials`.
4. Create `OAuth client ID` with application type `Web application`.
5. Under `Authorized redirect URIs`, add exactly:
   - `http://localhost:3000/api/auth/google/callback`
6. Save and copy the generated client ID/secret to `.env.local`.

Important: redirect URI must match exactly.

- `localhost` is different from `127.0.0.1`
- `http` is different from `https`
- Port must match (`3000` vs `3001`)
- Trailing slash differences matter

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create and fill env file:

```bash
cp .env.example .env.local
```

3. Start development server:

```bash
npm run dev
```

4. Open `http://localhost:3000` and click `Continue with Google`.

## Authentication Flow

1. Client navigates to `/api/auth/google`.
2. Passport redirects user to Google consent screen.
3. Google redirects back to `/api/auth/google/callback`.
4. Callback route validates profile and signs JWT.
5. Server sets HTTP-only cookie `auth_token`.
6. UI calls `/api/auth/me` to fetch auth status and user.
7. Logout calls `/api/auth/logout` to clear cookie.

## API Endpoints

### `GET /api/auth/google`
- Starts Google OAuth login flow.
- Response: redirect to Google.

### `GET /api/auth/google/callback`
- Handles Google callback and sets auth cookie.
- Response: redirect to `/` on success, `401` JSON on failure.

### `GET /api/auth/me`
- Returns current authentication state.
- Success response:

```json
{
  "authenticated": true,
  "user": {
    "id": "google-profile-id",
    "email": "user@example.com",
    "displayName": "User Name",
    "picture": "https://..."
  }
}
```

### `POST /api/auth/logout`
- Clears the auth cookie.
- Success response:

```json
{
  "message": "Logged out"
}
```

## Scripts

- `npm run dev` - Run local development server
- `npm run lint` - Run ESLint
- `npm run build` - Production build
- `npm run start` - Start production server

## Troubleshooting

### Error: `Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_CALLBACK_URL in environment.`

- Ensure key names are exact:
  - `GOOGLE_CLIENT_ID` (not `GOOGLE_CLINET_ID`)
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_CALLBACK_URL`
- Confirm file is `google-auth/.env.local`
- Restart dev server after env changes

### Error: `Error 400: redirect_uri_mismatch`

- In Google OAuth client, add exact redirect URI:
  - `http://localhost:3000/api/auth/google/callback`
- Ensure `.env.local` has matching `GOOGLE_CALLBACK_URL`
- Restart server after updates

## Security Notes

- Never commit `.env.local` or real secrets
- Rotate leaked Google client secrets immediately
- Use a strong random `JWT_SECRET` in production
- Keep `secure` cookies enabled in production

## Future Improvements

- Persist user records in a database
- Add protected route middleware
- Add refresh-token/session store strategy
- Add integration tests for auth routes
