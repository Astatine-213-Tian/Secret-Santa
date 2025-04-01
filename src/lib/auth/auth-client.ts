import { redirect } from "next/navigation"
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

const CALLBACK_URL = "/dashboard/events"

interface WithCallbackUrl {
  callbackUrl?: string | null
}

async function signInWithGoogle({ callbackUrl }: WithCallbackUrl) {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: callbackUrl || CALLBACK_URL,
  })
}

async function signInWithGitHub({ callbackUrl }: WithCallbackUrl) {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: callbackUrl || CALLBACK_URL,
  })
}

async function signInWithEmail({
  email,
  password,
  callbackUrl,
}: {
  email: string
  password: string
} & WithCallbackUrl) {
  return await authClient.signIn.email({
    email,
    password,
    callbackURL: callbackUrl || CALLBACK_URL,
  })
}

async function signUpWithEmail({
  email,
  password,
  name,
  callbackUrl,
}: {
  email: string
  password: string
  name: string
} & WithCallbackUrl) {
  return await authClient.signUp.email({
    email,
    password,
    name,
    callbackURL: callbackUrl || CALLBACK_URL,
  })
}

async function signOut() {
  await authClient.signOut()
  redirect("/login")
}

async function forgetPassword({ email }: { email: string }) {
  return await authClient.forgetPassword({
    email,
    redirectTo: "/reset-password",
  })
}

export const { useSession, getSession, sendVerificationEmail, resetPassword } =
  authClient
export {
  signInWithGoogle,
  signInWithGitHub,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  forgetPassword,
}
