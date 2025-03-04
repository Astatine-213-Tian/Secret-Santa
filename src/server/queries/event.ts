import "server-only"

import { and, asc, count, desc, eq, gte, ne, sql } from "drizzle-orm"

import { getUserId } from "@/lib/auth/auth-server"
import { db } from "@/server/db"
import { event, eventParticipant, EventSchema, user } from "@/server/db/schema"

export async function getOrganizedEvents() {
  const userId = await getUserId()

  const events = await db
    .select({
      eventId: event.id,
      name: event.name,
      eventDate: event.eventDate,
      drawDate: event.drawDate,
      location: event.location,
      participantsNum: count(eventParticipant.userId),
    })
    .from(event)
    .where(and(eq(event.organizerId, userId), gte(event.eventDate, new Date())))
    .leftJoin(eventParticipant, eq(event.id, eventParticipant.eventId))
    .groupBy(event.id)
    .orderBy(desc(event.eventDate))

  return events
}

export async function getJoinedEvents() {
  const userId = await getUserId()

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
    .leftJoin(user, eq(eventParticipant.secretFriendId, user.id))
    .orderBy(desc(event.eventDate))

  return events
}

export interface OrganizerViewEvent {
  details: EventSchema
  participants: {
    participant: {
      id: string
      name: string
    }
    secretFriend: {
      id: string
      name: string
    } | null
  }[]
}

export interface ParticipantViewEvent {
  details: EventSchema
}

type EventViewReturn =
  | { isOrganizer: true; eventInfo: OrganizerViewEvent }
  | { isOrganizer: false; eventInfo: ParticipantViewEvent }

export async function getEvent(eventId: string): Promise<EventViewReturn> {
  const result = await db.query.event.findFirst({
    where: and(eq(event.id, eventId), gte(event.eventDate, new Date())),
    with: {
      participants: {
        columns: {
          userId: true,
          secretFriendId: true,
        },
        with: {
          participant: {
            columns: {
              name: true,
            },
          },
          secretFriend: {
            columns: {
              name: true,
            },
          },
        },
        orderBy: asc(eventParticipant.joinedAt),
      },
    },
  })

  if (!result) {
    throw new Error("Event not found")
  }

  const isOrganizer = result.organizerId === (await getUserId())

  const { participants, ...details } = result

  if (isOrganizer) {
    return {
      isOrganizer: true,
      eventInfo: {
        details,
        participants: participants.map((p) => ({
          participant: {
            id: p.userId,
            name: p.participant.name,
          },
          secretFriend: p.secretFriendId
            ? {
                id: p.secretFriendId,
                name: p.secretFriend!.name,
              }
            : null,
        })),
      },
    }
  } else {
    return {
      isOrganizer: false,
      eventInfo: {
        details,
      },
    }
  }
}
