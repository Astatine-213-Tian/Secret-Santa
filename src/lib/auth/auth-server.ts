import { headers } from "next/headers"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "@/server/db"
import { hashPassword, verifyPassword } from "../password"

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    minPasswordLength: 8,
    maxPasswordLength: 16,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  advanced: {
    generateId: false,
  },
})

export async function getUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session.user.id
}
