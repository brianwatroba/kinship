import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession();

  if (req.nextUrl.pathname.startsWith(`/api/cron`) && process.env.NODE_ENV === "production") {
    if (!req.headers.get("referer")?.includes(process.env.APP_URL as string)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  return res;
}
