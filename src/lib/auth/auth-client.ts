import { createAuthClient } from "better-auth/react";
const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});


const CALLBACK_URL = "/"

async function signInWithGoogle() {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: CALLBACK_URL,
  });
}

async function signInWithGitHub() {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: CALLBACK_URL,
  });
}

async function signInWithEmail({ email, password }: { email: string, password: string }) {
  await authClient.signIn.email({
    email,
    password,
    callbackURL: CALLBACK_URL,
  });
}

async function signUpWithEmail({ email, password, name }: { email: string, password: string, name: string }) {
  await authClient.signUp.email({
    email,
    password,
    name,
    callbackURL: CALLBACK_URL,
  });
}

export const { useSession, getSession } = createAuthClient(); 
export { signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail };