import NextAuth, { type DefaultSession, type DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    accessToken?: string;
    refreshToken?: string;
    deviceId?: string;
    redirect?: string;
    callbackUrl?: string;
  }

  interface Session extends DefaultSession {
    user?: User;
    accessToken?: string;
    deviceId?: string;
    redirect?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    deviceId?: string;
    accessTokenExpires?: number;
    userId?: string | number;
    error?: string;
  }
}
