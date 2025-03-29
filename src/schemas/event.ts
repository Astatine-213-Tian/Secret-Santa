import { z } from "zod"

export const eventDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  budget: z
    .number({ required_error: "Budget is required" })
    .min(1, "Budget should be greater than 0"),
  eventDate: z.date({ required_error: "Event date is required" }),
})
