import { z } from "zod"

export const passwordSchema = z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters",
  })
  .max(16, {
    message: "Password must be less than 16 characters",
  })
  .regex(/[A-Za-z]/, {
    message: "Password must contain at least one letter",
  })
  .regex(/[0-9]/, {
    message: "Password must contain at least one number",
  })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  })
