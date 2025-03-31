"use server"

import { and, eq } from "drizzle-orm"
import normalizeEmail from "validator/lib/normalizeEmail"
import { z } from "zod"

import { getUserInfo } from "@/lib/auth/auth-server"
import { eventDetailsSchema } from "@/schemas/event"
import { db } from "../db"
import {
  assignment,
  assignmentExclusion,
  event,
  eventParticipant,
  invitation,
  user,
} from "../db/schema"

export async function createEvent(ev: z.infer<typeof eventDetailsSchema>) {
  try {
    eventDetailsSchema.parse(ev)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.message }
    }
    throw error
  }

  const { id: userId } = await getUserInfo()

  const newEvent = await db
    .insert(event)
    .values({
      ...ev,
      organizerId: userId,
    })
    .returning({ id: event.id })

  const eventId = newEvent[0]!.id

  await db.insert(eventParticipant).values({
    eventId: eventId,
    userId: userId,
  })

  return eventId
}

/**
 * Remove yourself from the event.
 * TODO: alert the organizer.
 */
export async function leaveEvent(eventId: string) {
  const { id: userId } = await getUserInfo()
  removeParticipant(eventId, userId)
}

export async function updateEvent(
  eventId: string,
  ev: z.infer<typeof eventDetailsSchema>
) {
  try {
    eventDetailsSchema.parse(ev)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.message }
    }
    throw error
  }

  const { id: userId } = await getUserInfo()

  await db
    .update(event)
    .set({
      name: ev.name,
      description: ev.description,
      budget: ev.budget,
      eventDate: ev.eventDate,
      location: ev.location,
    })
    .where(and(eq(event.id, eventId), eq(event.organizerId, userId)))
}

export async function deleteEvent(eventId: string) {
  const { id: userId } = await getUserInfo()

  await db
    .delete(event)
    .where(and(eq(event.id, eventId), eq(event.organizerId, userId)))
}

export async function createInvitation(eventId: string, email: string) {
  await checkOrganizer(eventId)

  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) {
    return { error: "Invalid email" }
  }

  // check if the participant already exists
  const existingParticipant = await db.query.user.findFirst({
    where: eq(user.normalizedEmail, normalizedEmail),
    with: {
      eventParticipants: {
        where: eq(eventParticipant.eventId, eventId),
        columns: {
          userId: true,
        },
      },
    },
    columns: {
      id: true,
    },
  })

  if (existingParticipant?.eventParticipants.length) {
    return { error: "Participant already exists" }
  }

  // check if the invitation already exists
  const existingInvitation = await db.query.invitation.findFirst({
    where: and(
      eq(invitation.eventId, eventId),
      eq(invitation.normalizedEmail, normalizedEmail),
      eq(invitation.revoked, false)
    ),
  })

  // if the invitation exists, check if it is pending
  if (existingInvitation) {
    return { error: "Invitation already exists" }
  }

  // invitation does not exist, create a new one
  const newInvitation = await db
    .insert(invitation)
    .values({
      eventId: eventId,
      email: email,
      normalizedEmail: normalizedEmail,
    })
    .returning()

  // TODO: send the invitation link to the participant
  const token = newInvitation[0]!.token
  const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/${token}`
  console.log("invitationLink", invitationLink)
}

export async function acceptInvitation(token: string) {
  const { id: userId } = await getUserInfo()

  const result = await db.query.invitation.findFirst({
    where: and(eq(invitation.token, token), eq(invitation.revoked, false)),
  })

  if (!result) {
    return { error: "Invitation not found" }
  }

  if (result.expiresAt < new Date()) {
    return { error: "Invitation expired" }
  }

  if (result.accepted) {
    return { error: "Invitation already accepted" }
  }

  await db
    .update(invitation)
    .set({
      accepted: true,
      updatedAt: new Date(),
    })
    .where(eq(invitation.token, token))

  await db.insert(eventParticipant).values({
    eventId: result.eventId,
    userId: userId,
  })

  return { success: "Invitation accepted" }
}

export async function revokeInvitation(eventId: string, email: string) {
  await checkOrganizer(eventId)

  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) {
    throw new Error("Invalid email")
  }

  const result = await db.query.invitation.findFirst({
    where: and(
      eq(invitation.eventId, eventId),
      eq(invitation.normalizedEmail, normalizedEmail),
      eq(invitation.revoked, false)
    ),
  })

  if (!result) {
    throw new Error("Invitation not found")
  }

  await db
    .update(invitation)
    .set({
      revoked: true,
      updatedAt: new Date(),
    })
    .where(eq(invitation.token, result.token))
}

// resend invitation and update the expiration date
export async function resendInvitation(eventId: string, email: string) {
  await checkOrganizer(eventId)

  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) {
    throw new Error("Invalid email")
  }

  const result = await db
    .update(invitation)
    .set({
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(invitation.eventId, eventId),
        eq(invitation.normalizedEmail, normalizedEmail),
        eq(invitation.revoked, false)
      )
    )
    .returning()

  if (!result[0]!.token) {
    throw new Error("Invitation not found")
  }

  // TODO: send the invitation link to the participant
  const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/${result[0]!.token}`
  console.log("invitationLink", invitationLink)
}

export async function removeParticipant(
  eventId: string,
  participantId: string
) {
  const { id: organizerId } = await checkOrganizer(eventId)
  // if the participant is the organizer, throw an error
  if (participantId === organizerId) {
    throw new Error("Cannot remove organizer from event")
  }

  await db.transaction(async (tx) => {
    // delete the participant from the event
    const deletedParticipant = await tx
      .delete(eventParticipant)
      .where(
        and(
          eq(eventParticipant.eventId, eventId),
          eq(eventParticipant.userId, participantId)
        )
      )
      .returning()

    if (deletedParticipant[0]?.userId) {
      // get the participant's normalized email
      const participant = await tx.query.user.findFirst({
        where: eq(user.id, deletedParticipant[0]!.userId),
      })

      if (!participant) {
        throw new Error("Participant not found")
      }

      // revoke the invitation
      await tx
        .update(invitation)
        .set({
          revoked: true,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(invitation.eventId, eventId),
            eq(invitation.normalizedEmail, participant.normalizedEmail)
          )
        )
    }
  })
}

export async function addExclusionRule(
  eventId: string,
  giverId: string,
  forbiddenReceiverId: string
) {
  await checkOrganizer(eventId)

  const result = await db
    .insert(assignmentExclusion)
    .values({
      eventId: eventId,
      giverId: giverId,
      forbiddenReceiverId: forbiddenReceiverId,
    })
    .onConflictDoNothing()
    .returning()

  if (!result[0]) {
    return { error: "Rule already exists" }
  }
}

export async function deleteExclusionRule(
  eventId: string,
  giverId: string,
  forbiddenReceiverId: string
) {
  await checkOrganizer(eventId)

  await db
    .delete(assignmentExclusion)
    .where(
      and(
        eq(assignmentExclusion.eventId, eventId),
        eq(assignmentExclusion.giverId, giverId),
        eq(assignmentExclusion.forbiddenReceiverId, forbiddenReceiverId)
      )
    )
}

export async function drawAssignments(eventId: string) {
  await checkOrganizer(eventId)

  const [participants, exclusionRules] = await Promise.all([
    db.query.eventParticipant.findMany({
      where: eq(eventParticipant.eventId, eventId),
      columns: { userId: true },
      with: {
        participant: {
          columns: { name: true },
        },
      },
    }),
    db.query.assignmentExclusion.findMany({
      where: eq(assignmentExclusion.eventId, eventId),
      columns: { giverId: true, forbiddenReceiverId: true },
    }),
  ])

  // Build a map of participants with their name
  const participantsMap = new Map<string, string>()
  for (const { userId, participant } of participants) {
    participantsMap.set(userId, participant.name)
  }

  const giverIds = participants.map((p) => p.userId)
  const receiverIds = new Set(giverIds)

  // Build exclusion map
  const exclusionMap = new Map<string, Set<string>>()
  for (const { giverId, forbiddenReceiverId } of exclusionRules) {
    if (!exclusionMap.has(giverId)) exclusionMap.set(giverId, new Set())
    exclusionMap.get(giverId)!.add(forbiddenReceiverId)
  }

  // Recursive backtracking function
  function solve(
    index: number,
    currentAssignments: Map<string, string>,
    usedReceivers: Set<string>
  ): boolean {
    if (index === giverIds.length) return true

    const giverId = giverIds[index]!
    const forbidden = exclusionMap.get(giverId) ?? new Set()

    for (const receiverId of receiverIds) {
      if (
        receiverId !== giverId &&
        !usedReceivers.has(receiverId) &&
        !forbidden.has(receiverId)
      ) {
        currentAssignments.set(giverId, receiverId)
        usedReceivers.add(receiverId)

        if (solve(index + 1, currentAssignments, usedReceivers)) {
          return true
        }

        // Backtrack
        currentAssignments.delete(giverId)
        usedReceivers.delete(receiverId)
      }
    }

    return false
  }

  const assignmentsMap = new Map<string, string>()
  const success = solve(0, assignmentsMap, new Set())

  if (!success) {
    return {
      error:
        "Could not find a valid assignment that satisfies all constraints. Try removing some exclusion rules.",
    }
  }

  const assignments = Array.from(assignmentsMap.entries())
    .map(([giverId, receiverId]) => ({
      giver: {
        id: giverId,
        name: participantsMap.get(giverId)!,
      },
      receiver: {
        id: receiverId,
        name: participantsMap.get(receiverId)!,
      },
    }))
    .sort((a, b) => a.giver.name.localeCompare(b.giver.name))

  await db.transaction(async (tx) => {
    await tx
      .update(event)
      .set({ drawCompleted: true })
      .where(eq(event.id, eventId))

    for (const { giver, receiver } of assignments) {
      await tx
        .insert(assignment)
        .values({ eventId, giverId: giver.id, receiverId: receiver.id })
        .onConflictDoUpdate({
          target: [assignment.eventId, assignment.giverId],
          set: { receiverId: receiver.id },
        })
    }
  })

  return assignments
}

export async function editAssignment(
  eventId: string,
  assignments: { giverId: string; receiverId: string }[]
) {
  await checkOrganizer(eventId)

  // Get all participants in the event
  const participants = await db.query.eventParticipant.findMany({
    where: eq(eventParticipant.eventId, eventId),
    columns: { userId: true },
    with: {
      participant: {
        columns: { name: true },
      },
    },
  })
  const participantIds = new Set(participants.map((p) => p.userId))

  // Validate that all participants are included and no conflicts exist
  const givers = new Set<string>()
  const receivers = new Set<string>()

  for (const { giverId, receiverId } of assignments) {
    // Check that giver and receiver are participants in the event
    if (!participantIds.has(giverId) || !participantIds.has(receiverId)) {
      // not return the error to prevent leaking information about the participants
      throw new Error("Assignment includes non-participant users")
    }

    // Check self-assignment
    if (giverId === receiverId) {
      return { error: "Self-assignment is not allowed" }
    }

    // Check for duplicates
    if (givers.has(giverId)) {
      return {
        error: `User ${participants.find((p) => p.userId === giverId)!.participant.name} appears multiple times as a giver`,
      }
    }
    if (receivers.has(receiverId)) {
      return {
        error: `User ${participants.find((p) => p.userId === receiverId)!.participant.name} appears multiple times as a receiver`,
      }
    }

    givers.add(giverId)
    receivers.add(receiverId)
  }

  // Verify all participants are included
  if (
    givers.size !== participantIds.size ||
    receivers.size !== participantIds.size
  ) {
    return { error: "Assignment must include all participants exactly once" }
  }

  // Update assignments in the database
  await db.transaction(async (tx) => {
    // Delete existing assignments
    await tx.delete(assignment).where(eq(assignment.eventId, eventId))

    // Insert new assignments
    for (const { giverId, receiverId } of assignments) {
      await tx.insert(assignment).values({
        eventId,
        giverId,
        receiverId,
      })
    }

    // Mark the event's draw as completed
    await tx
      .update(event)
      .set({ drawCompleted: true })
      .where(eq(event.id, eventId))
  })
}

// --- Helper functions ---
async function checkOrganizer(eventId: string) {
  const { id: userId } = await getUserInfo()
  const eventOrganizer = await db.query.event.findFirst({
    where: and(eq(event.id, eventId), eq(event.organizerId, userId)),
  })
  if (!eventOrganizer) {
    throw new Error("Unauthorized")
  }
  return eventOrganizer
}
