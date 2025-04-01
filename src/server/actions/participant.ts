"use server"

import { revalidatePath } from "next/cache"
import { and, eq, or } from "drizzle-orm"

import { getUserInfo } from "@/lib/auth/auth-server"
import { db } from "../db"
import { assignmentExclusion, event, eventParticipant } from "../db/schema"
import { clearAssignments, drawAssignments } from "./assignment"

/**
 * Remove a participant from an event. This will:
 * - delete the participant from the event
 * - delete the assignments related to the participant
 * - if the event has already been drawn,
 *  - if autoRedraw is true, attempt to redraw the assignments
 *  - if autoRedraw is false, set assignments to null
 * @param eventId - The ID of the event
 * @param participantId - The ID of the participant to remove
 * @param autoRedraw - Whether to redraw the assignments (only matter if the event has already been drawn)
 */

export async function removeParticipant(
  eventId: string,
  participantId: string,
  autoRedraw: boolean = false
) {
  const { id: userId } = await getUserInfo()
  const eventOrganizer = await db.query.event.findFirst({
    where: and(eq(event.id, eventId)),
    columns: {
      organizerId: true,
      drawCompleted: true,
    },
  })

  if (!eventOrganizer) {
    throw new Error("Event not found")
  }
  // only the organizer or the participant themselves can remove themselves
  if (eventOrganizer.organizerId !== userId && participantId !== userId) {
    throw new Error("Unauthorized")
  }
  // cannot remove the organizer from the event
  if (participantId === eventOrganizer.organizerId) {
    throw new Error("Cannot remove organizer from event")
  }

  let error: string | null = null

  // delete the participant from the event
  const deletedParticipant = await db
    .delete(eventParticipant)
    .where(
      and(
        eq(eventParticipant.eventId, eventId),
        eq(eventParticipant.userId, participantId)
      )
    )
    .returning({
      userId: eventParticipant.userId,
    })

  if (!deletedParticipant[0]?.userId) return

  // delete exclusion rules related to the participant
  await db
    .delete(assignmentExclusion)
    .where(
      or(
        eq(assignmentExclusion.giverId, participantId),
        eq(assignmentExclusion.forbiddenReceiverId, participantId)
      )
    )

  if (!eventOrganizer.drawCompleted) return

  if (autoRedraw) {
    // attempt to redraw the assignments
    const res = await drawAssignments(eventId)
    if (res?.error) {
      await clearAssignments(eventId)
      error = res.error
    }
  } else {
    // clear the assignments
    await clearAssignments(eventId)
  }

  revalidatePath(`/dashboard/events/${eventId}`)

  if (error) {
    return { error }
  }
}

/**
 * Remove yourself from the event.
 * TODO: alert the organizer.
 */
export async function removeSelfFromEvent(eventId: string) {
  const { id: userId } = await getUserInfo()
  removeParticipant(eventId, userId)
}
