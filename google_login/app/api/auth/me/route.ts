import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyJwt } from "@/app/lib/jwt";

export const runtime = "nodejs";

export const GET = async () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return NextResponse.json(
      { error: "Missing JWT_SECRET" },
      { status: 500 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const payload = verifyJwt(token, jwtSecret);
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user: payload });
};
