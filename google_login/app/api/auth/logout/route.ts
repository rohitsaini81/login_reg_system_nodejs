import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const POST = async () => {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
};
