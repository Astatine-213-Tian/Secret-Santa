import { headers } from "next/headers"
import { betterAuth } from "better-auth"
import { emailHarmony } from "better-auth-harmony"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "@/server/db"
import { renderVerificationEmail } from "@/components/emails/email-verification"
import { renderPasswordResetEmail } from "@/components/emails/password-reset"
import { sendEmail } from "../email"
import { hashPassword, verifyPassword } from "../password"

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    additionalFields: {
      normalizedEmail: {
        type: "string",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
    minPasswordLength: 8,
    maxPasswordLength: 16,
    requireEmailVerification: true,
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    sendResetPassword: async ({ user, url }) => {
      console.log("Reset password url", url)
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
        html: await renderPasswordResetEmail({
          resetPasswordLink: url,
          expiryTime: "1 hour",
        }),
      })
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
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every day)
  },
  advanced: {
    generateId: false,
  },
  plugins: [emailHarmony()],
  rateLimit: {
    window: 10, // time window in seconds
    max: 100, // max requests in the window
    enabled: true,
  },
})

/**
 * Get the user id from the session
 * @returns The user object
 * @throws Unauthorized if the user is not authenticated
 */
export async function getUserInfo() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session.user
}

/**
 * Get the session from the session cookie
 * @returns The session object
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}
