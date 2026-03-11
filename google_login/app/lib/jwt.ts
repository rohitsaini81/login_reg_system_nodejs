import crypto from "crypto";

type JwtPayload = Record<string, unknown> & {
  exp?: number;
  iat?: number;
  sub?: string;
};

const encoder = new TextEncoder();

const base64UrlEncode = (input: Buffer | string) => {
  const buffer = typeof input === "string" ? Buffer.from(input) : input;
  return buffer
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

const base64UrlDecode = (input: string) => {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const buffer = Buffer.from(padded, "base64");
  return buffer.toString("utf8");
};

export const signJwt = (payload: JwtPayload, secret: string) => {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", encoder.encode(secret))
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${data}.${signature}`;
};

export const verifyJwt = (token: string, secret: string) => {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [encodedHeader, encodedPayload, signature] = parts;
  const data = `${encodedHeader}.${encodedPayload}`;
  const expected = crypto
    .createHmac("sha256", encoder.encode(secret))
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  if (expected !== signature) return null;

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
  if (payload.exp && Date.now() / 1000 > payload.exp) return null;
  return payload;
};
