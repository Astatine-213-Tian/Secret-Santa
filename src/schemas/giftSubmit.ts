import { z } from "zod"

export const giftSubmitSchema = z.object({
  description: z.string().min(1, "Description is required"),
  note: z.string().optional(),
})
