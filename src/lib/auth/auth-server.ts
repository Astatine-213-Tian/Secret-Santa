import { headers } from "next/headers"
import { betterAuth } from "better-auth"
import { emailHarmony } from "better-auth-harmony"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "@/server/db"
import { renderVerificationEmail } from "@/components/emails/email-verification"
import { sendEmail } from "../email"
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
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      console.log("Reset password user", user)
      console.log("Reset password url", url)
      // TODO: Send reset email
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 1000 * 60 * 60 * 24, // 1 day
    sendVerificationEmail: async ({ user, url }) => {
      console.log("Verification url", url)
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
        html: await renderVerificationEmail({
          username: user.name,
          verificationLink: url,
        }),
      })
    },
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
  plugins: [emailHarmony()],
})

/**
 * Get the user id from the session
 * @returns The user id
 * @throws Unauthorized if the user is not authenticated
 */
export async function getUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session.user.id
}
