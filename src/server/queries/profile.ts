// import "server-only"
"use server"

import { eq, InferSelectModel } from "drizzle-orm"

import { getUserInfo } from "@/lib/auth/auth-server"
import { db } from "@/server/db"
import { user } from "@/server/db/schema"

// Get the full user type from Drizzle

// Define access modes with column selections
const accessModes = {
  my_profile: {
    id: true,
    name: true,
    email: true,
    image: true,
    createdAt: true,
    bio: true,
    giftPreferences: true,
  },
  my_event_participant: {
    id: true,
    name: true,
    email: true,
    image: true,
    createdAt: true,
    bio: true,
    giftPreferences: true,
  },
  my_event_organizer: {
    id: true,
    name: true,
    email: true,
    image: true,
    createdAt: false,
    bio: false,
    giftPreferences: false,
  },
  my_gift_receiver: {
    id: true,
    name: true,
    email: true,
    image: true,
    bio: true,
    giftPreferences: true,
  },
  my_gifter: {
    id: true,
    name: true,
    email: true,
    image: true,
    bio: false,
    giftPreferences: false,
    createdAt: false,
  },
} as const

// Get the full user type from Drizzle
type User = InferSelectModel<typeof user>

// Create a type that maps each access mode to a filtered user type
export type AccessModeMap = {
  [K in keyof typeof accessModes]: {
    [P in keyof (typeof accessModes)[K] as (typeof accessModes)[K][P] extends true
      ? P
      : never]: P extends keyof User ? User[P] : never
  }
}

/**
 * Get details from a user's profile with proper typing based on access mode.
 * @param accessMode - The level of access/view to return
 * @param userId - Optional user ID, defaults to current user
 * @returns A user profile with fields determined by the access mode
 */
export async function getProfile<T extends keyof typeof accessModes>(
  accessMode: T,
  userId?: string
) {
  if (!userId && accessMode === "my_profile") {
    // get profile-info for the current user.
    const userInfo = await getUserInfo()
    userId = userInfo.id
  }

  if (!userId) {
    throw new Error("Profile not found")
  }

  const result = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: accessModes[accessMode],
  })

  if (!result) {
    throw new Error("Profile not found")
  }

  // The result should match our expected type structure, but TypeScript needs help
  return result as unknown as AccessModeMap[T]
}
