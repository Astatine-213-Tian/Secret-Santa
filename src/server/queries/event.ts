import "server-only"

import { and, asc, desc, eq, gte, ne, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { getUserInfo } from "@/lib/auth/auth-server"
import { db } from "@/server/db"
import {
  assignment,
  assignmentExclusion,
  event,
  eventParticipant,
  EventSchema,
  invitation,
  user,
} from "@/server/db/schema"

export async function getOrganizedEvents() {
  const { id: userId } = await getUserInfo()

  const events = await db
    .select({
      eventId: event.id,
      name: event.name,
      eventDate: event.eventDate,
      location: event.location,
      drawCompleted: event.drawCompleted,
    })
    .from(event)
    .where(and(eq(event.organizerId, userId), gte(event.eventDate, new Date())))
    .groupBy(event.id)
    .orderBy(desc(event.eventDate))

  return events
}

export async function getJoinedEvents() {
  const { id: userId } = await getUserInfo()

  const events = await db
    .select({
      eventId: event.id,
      name: event.name,
      eventDate: event.eventDate,
      location: event.location,
      budget: event.budget,
      secretFriend: sql<string>`COALESCE(${user.name}, 'Pending')`,
    })
    .from(eventParticipant)
    .where(eq(eventParticipant.userId, userId))
    .innerJoin(
      event,
      and(
        eq(eventParticipant.eventId, event.id),
        ne(event.organizerId, userId), // exclude events that the user is the organizer of
        gte(event.eventDate, new Date())
      )
    )
    .leftJoin(
      assignment,
      and(
        eq(assignment.eventId, event.id),
        eq(assignment.giverId, userId) // Only get assignments where the user is the giver
      )
    )
    .leftJoin(user, eq(assignment.receiverId, user.id))
    .orderBy(desc(event.eventDate))

  return events
}

export interface OrganizerViewEvent {
  details: EventSchema
  participants: {
    id: string
    name: string
    email: string
  }[]
  invitations: {
    email: string
    status: "pending" | "expired"
  }[]
  exclusionRules: {
    giver: {
      id: string
      name: string
    }
    forbiddenReceiver: {
      id: string
      name: string
    }
  }[]
  assignments: {
    giver: {
      id: string
      name: string
    }
    receiver: {
      id: string
      name: string
    } | null
  }[]
}

export interface ParticipantViewEvent {
  details: EventSchema
  secretFriend: {
    id: string
    name: string
  } | null
}

type EventViewReturn =
  | { role: "organizer"; eventInfo: OrganizerViewEvent }
  | { role: "participant"; eventInfo: ParticipantViewEvent }

export async function getEventInfo(eventId: string): Promise<EventViewReturn> {
  const { id: userId } = await getUserInfo()
  const eventDetails = await db.query.event.findFirst({
    where: eq(event.id, eventId),
  })

  if (!eventDetails) {
    throw new Error("Event not found")
  }

  const isOrganizer = eventDetails.organizerId === userId

  // If the user is not the organizer, return the secret friend with event details
  if (!isOrganizer) {
    const secretFriend = await db.query.assignment.findFirst({
      where: and(
        eq(assignment.eventId, eventId),
        eq(assignment.giverId, userId)
      ),
      with: {
        receiver: {
          columns: {
            name: true,
            id: true,
          },
        },
      },
    })
    return {
      role: "participant",
      eventInfo: {
        details: eventDetails,
        secretFriend: secretFriend?.receiver ?? null,
      },
    }
  }

  // If the user is the organizer, return the event details, participants, invitations, rules, and assignments
  const [participants, invitations, exclusionRules, assignments] =
    await Promise.all([
      fetchParticipants(eventId),
      fetchPendingInvitations(eventId),
      fetchExclusionRules(eventId),
      fetchAssignments(eventId),
    ])

  return {
    role: "organizer",
    eventInfo: {
      details: eventDetails,
      participants,
      invitations,
      exclusionRules,
      assignments:
        assignments.length > 0
          ? assignments
          : participants.map((p) => ({
              giver: {
                id: p.id,
                name: p.name,
              },
              receiver: null,
            })),
    },
  }
}

// return query to fetch participants of an event
function fetchParticipants(eventId: string) {
  return db
    .select({
      id: eventParticipant.userId,
      name: user.name,
      email: user.email,
    })
    .from(eventParticipant)
    .innerJoin(user, eq(eventParticipant.userId, user.id))
    .where(eq(eventParticipant.eventId, eventId))
}

// return query to fetch pending or expired invitations of an event
function fetchPendingInvitations(eventId: string) {
  return db
    .select({
      email: invitation.email,
      status: sql<
        "pending" | "expired"
      >`CASE WHEN ${invitation.expiresAt} > now() THEN 'pending' ELSE 'expired' END`,
    })
    .from(invitation)
    .where(
      and(
        eq(invitation.eventId, eventId),
        eq(invitation.accepted, false),
        eq(invitation.revoked, false)
      )
    )
    .orderBy(desc(invitation.updatedAt))
}

// return query to fetch exclusion rules of an event
function fetchExclusionRules(eventId: string) {
  return db.query.assignmentExclusion.findMany({
    where: eq(assignmentExclusion.eventId, eventId),
    with: {
      giver: {
        columns: {
          name: true,
          id: true,
        },
      },
      forbiddenReceiver: {
        columns: {
          name: true,
          id: true,
        },
      },
    },
    orderBy: desc(assignmentExclusion.createdAt),
  })
}

function fetchAssignments(eventId: string) {
  const userGiver = alias(user, "giver")
  const userReceiver = alias(user, "receiver")

  return db
    .select({
      giver: {
        id: assignment.giverId,
        name: userGiver.name,
      },
      receiver: {
        id: assignment.receiverId,
        name: userReceiver.name,
      },
    })
    .from(assignment)
    .innerJoin(userGiver, eq(assignment.giverId, userGiver.id))
    .innerJoin(userReceiver, eq(assignment.receiverId, userReceiver.id))
    .where(eq(assignment.eventId, eventId))
    .orderBy(asc(userGiver.name))
}

/**
 * Fetch All Assigments for the current user
 */
export async function fetchUserGiftReceivers() {
  const { id: userId } = await getUserInfo()
  const userReceiver = alias(user, "receiver")
  const eventDetails = alias(event, "event")

  return db
    .select({
      event: {
        id: eventDetails.id,
        name: eventDetails.name,
      },
      receiver: {
        id: userReceiver.id,
        name: userReceiver.name,
      },
    })
    .from(assignment)
    .innerJoin(eventDetails, eq(assignment.eventId, eventDetails.id))
    .innerJoin(userReceiver, eq(assignment.receiverId, userReceiver.id))
    .where(eq(assignment.giverId, userId))
}

export async function fetchUserGiftGivers() {
  const { id: userId } = await getUserInfo()

  const userGiver = alias(user, "giver")
  const eventDetails = alias(event, "event")

  const results = await db
    .select({
      event: {
        id: eventDetails.id,
        name: eventDetails.name,
        date: eventDetails.eventDate,
      },
      giver: {
        id: userGiver.id,
        name: userGiver.name,
      },
    })
    .from(assignment)
    .innerJoin(eventDetails, eq(assignment.eventId, eventDetails.id))
    .innerJoin(userGiver, eq(assignment.giverId, userGiver.id))
    .where(eq(assignment.receiverId, userId))
  // Modify the results: Remove `receiver` if event is in the future
  return results.map(({ event, giver }) => ({
    event: {
      id: event.id,
      name: event.name,
    },
    giver: new Date(event.date) > new Date() ? null : giver, // Remove receiver if event is in the future
  }))
}
