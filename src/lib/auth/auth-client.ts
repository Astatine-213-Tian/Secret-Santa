import { redirect } from "next/navigation"
import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

const CALLBACK_URL = "/dashboard/events"

async function signInWithGoogle() {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: CALLBACK_URL,
  })
}

async function signInWithGitHub() {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: CALLBACK_URL,
  })
}

async function signInWithEmail({
  email,
  password,
}: {
  email: string
  password: string
}) {
  return await authClient.signIn.email({
    email,
    password,
    callbackURL: CALLBACK_URL,
  })
}

async function signUpWithEmail({
  email,
  password,
  name,
}: {
  email: string
  password: string
  name: string
}) {
  return await authClient.signUp.email({
    email,
    password,
    name,
    callbackURL: CALLBACK_URL,
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
