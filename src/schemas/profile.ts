import { z } from "zod"

const longText = z
  .string()
  .max(500, { message: "Must be less than 500 characters" })
const shortText = z
  .string()
  .max(200, { message: "Must be less than 200 characters" })

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  bio: longText,
  giftPreferences: z.object({
    likes: longText,
    dislikes: longText,
    sizes: shortText,
    allergies: shortText,
    additionalInfo: longText,
  }),
})
