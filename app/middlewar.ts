import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Ambil token dari session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Jika token tidak ada (user belum login), redirect ke halaman login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}
