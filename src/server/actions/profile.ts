"use server"

import { eq } from "drizzle-orm"

import { getUserId } from "@/lib/auth/auth-server"
import { GiftPreferences } from "@/lib/types"
import { db } from "../db"
import { user } from "../db/schema"

export interface UpdateProfileProps {
  name: string
  bio: string
  giftPreferences: GiftPreferences
}

export async function updateProfile(profile: UpdateProfileProps) {
  const userId = await getUserId()
  const { name, bio, giftPreferences } = profile
  await db
    .update(user)
    .set({ name, bio, giftPreferences })
    .where(eq(user.id, userId))
}
