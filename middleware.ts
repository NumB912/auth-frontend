// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (token) return NextResponse.next();
  if (!token && refreshToken) {
    const refreshRes = await fetch(
      `${process.env.API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: { Cookie: `refresh_token=${refreshToken}` },
      },
    );

    const setCookies = refreshRes.headers.getSetCookie();

    const tokenCookieStr = setCookies.find((c) => c.startsWith("token="));

    if (!tokenCookieStr)
      return NextResponse.redirect(new URL("/sign-in", req.url));

    const parts = tokenCookieStr.split(";").map((p) => p.trim());

    const value = parts[0].slice("token=".length);
    const maxAge = parts
      .find((p) => p.toLowerCase().startsWith("max-age="))
      ?.split("=")[1];
    const path = parts
      .find((p) => p.toLowerCase().startsWith("path="))
      ?.split("=")[1];
    const httpOnly = parts.some((p) => p.toLowerCase() === "httponly");
    const sameSite = parts
      .find((p) => p.toLowerCase().startsWith("samesite="))
      ?.split("=")[1] as "lax" | "strict" | "none" | undefined;

    const response = NextResponse.next();

    response.cookies.set("token", value, {
      httpOnly,
      path: path ?? "/",
      sameSite: sameSite?.toLowerCase() as
        | "lax"
        | "strict"
        | "none"
        | undefined,
      ...(maxAge && { maxAge: Number(maxAge) }),
    });

    return response;
  }

  return NextResponse.redirect(new URL("/sign-in", req.url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sign-in|sign-up|send-change-pass|send-sign-up|otp-confirm|wait-change-pass|change-password).*)",
  ],
};