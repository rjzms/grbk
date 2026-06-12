import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SESSION_MAX_AGE } from "./constants";

export interface SessionData {
  userId?: string;
  username?: string;
}

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET 环境变量未设置。请复制 .env.example 为 .env 并配置密钥。");
}

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "grbk_sid",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE,
    path: "/",
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

export async function createSession(userId: string, username: string) {
  const session = await getSession();
  session.userId = userId;
  session.username = username;
  await session.save();
}

export async function destroySession() {
  const session = await getSession();
  session.destroy();
}
