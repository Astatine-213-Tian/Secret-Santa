"use server"

import { and, eq } from "drizzle-orm"

import { getUserInfo } from "@/lib/auth/auth-server"
import { GiftSubmitFormData } from "@/lib/types"
import { db } from "../db"
import { assignment, giftSubmit } from "../db/schema"

/**
 * Create a new gift submission entry
 */
export async function submitGift(
  assignmentEventId: string,
  giftDetails: GiftSubmitFormData
) {
  const { id: userId } = await getUserInfo()

  // Ensure the user actually has an assignment for this event
  const userAssignment = await db.query.assignment.findFirst({
    where: and(
      eq(assignment.eventId, assignmentEventId),
      eq(assignment.giverId, userId)
    ),
  })

  if (!userAssignment) {
    return { error: "You do not have an assignment for this event." }
  }

  // Ensure no duplicate submissions exist
  const existingGift = await db.query.giftSubmit.findFirst({
    where: and(
      eq(giftSubmit.assignmentEventId, assignmentEventId),
      eq(giftSubmit.assignmentGiverId, userId)
    ),
  })

  if (existingGift) {
    return { error: "You have already submitted a gift for this assignment." }
  }

  // Insert the gift submission into the database
  const newGiftSubmit = await db
    .insert(giftSubmit)
    .values({
      assignmentEventId: assignmentEventId,
      assignmentGiverId: userId,
      giftDetails: giftDetails,
      submittedAt: new Date(),
    })
    .returning({ id: giftSubmit.id })

  return newGiftSubmit[0]!.id
}
