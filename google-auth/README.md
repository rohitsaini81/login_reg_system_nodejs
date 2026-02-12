This is a Next.js app with Google OAuth login implemented using Passport.js.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env.local
```

3. In Google Cloud Console, create OAuth credentials and set the redirect URI to:

```text
http://localhost:3000/api/auth/google/callback
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) and click "Continue with Google".

## Environment Variables

Defined in `.env.example`:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `JWT_SECRET`

`JWT_SECRET` is used to sign the auth cookie token after a successful Google login.
