import { cookies } from "next/headers";

const COOKIE = "unkhair_admin";
const TOKEN = process.env.ADMIN_TOKEN || "unkhair-admin-2026";
export const ADMIN_USER = process.env.ADMIN_USER || "admin";
export const ADMIN_PASS = process.env.ADMIN_PASS || "unkhair123";

export function setAdminSession() {
  cookies().set(COOKIE, TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export function clearAdminSession() {
  cookies().delete(COOKIE);
}

export function isAdmin(): boolean {
  return cookies().get(COOKIE)?.value === TOKEN;
}
