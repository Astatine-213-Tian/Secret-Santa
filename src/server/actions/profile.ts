"use server"

import { eq } from "drizzle-orm"
import { z } from "zod"

import { getUserId } from "@/lib/auth/auth-server"
import { userProfileSchema } from "@/schemas/user"
import { db } from "../db"
import { user } from "../db/schema"

export async function updateProfile(
  profile: z.infer<typeof userProfileSchema>
) {
  try {
    userProfileSchema.parse(profile)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.message)
    }
    throw error
  }
  const userId = await getUserId()
  const { name, bio, giftPreferences } = profile
  await db
    .update(user)
    .set({ name, bio, giftPreferences })
    .where(eq(user.id, userId))
}
