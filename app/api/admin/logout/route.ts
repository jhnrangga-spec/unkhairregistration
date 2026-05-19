import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST() {
    clearAdminSession();
    return NextResponse.redirect(new URL("/admin", process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"), { status: 303 });
}
