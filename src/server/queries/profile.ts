import "server-only"

import { eq } from "drizzle-orm"

import { getUserInfo } from "@/lib/auth/auth-server"
import { db } from "@/server/db"
import { user } from "@/server/db/schema"

export async function getProfile() {
  const { id: userId } = await getUserInfo()
  const result = await db.query.user.findFirst({
    where: eq(user.id, userId),
    columns: {
      bio: true,
      giftPreferences: true,
      email: true,
      name: true,
      image: true,
    },
  })

  if (!result) {
    throw new Error("Profile not found")
  }

  return {
    email: result.email,
    name: result.name,
    bio: result.bio ?? "",
    giftPreferences: result.giftPreferences ?? {
      likes: "",
      dislikes: "",
      sizes: "",
      allergies: "",
      additionalInfo: "",
    },
    avatarUrl: result.image,
  }
}
