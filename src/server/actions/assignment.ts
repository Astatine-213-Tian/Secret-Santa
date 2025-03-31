import { and, eq } from "drizzle-orm"

import { getUserInfo } from "@/lib/auth/auth-server"
import { db } from "../db"
import {
  assignment,
  assignmentExclusion,
  event,
  eventParticipant,
} from "../db/schema"

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

  return {
    data: assignments,
  }
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

export async function clearAssignments(eventId: string) {
  await checkOrganizer(eventId)

  await db.transaction(async (tx) => {
    await tx.delete(assignment).where(eq(assignment.eventId, eventId))
    await tx
      .update(event)
      .set({ drawCompleted: false })
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
