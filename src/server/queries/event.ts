import "server-only"

import { and, count, desc, eq, gte, sql } from "drizzle-orm"

import { getUserId } from "@/lib/auth/auth-server"
import { db } from "@/server/db"
import {
  event,
  eventAdmin,
  eventParticipant,
  santaPair,
  user,
} from "@/server/db/schema"

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
    .from(eventAdmin)
    .where(eq(eventAdmin.userId, userId))
    .innerJoin(
      event,
      and(eq(eventAdmin.eventId, event.id), gte(event.eventDate, new Date()))
    )
    .leftJoin(eventParticipant, eq(event.id, eventParticipant.eventId))
    .groupBy(event.id)
    .orderBy(desc(event.eventDate))

  console.log(events)

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
        gte(event.eventDate, new Date())
      )
    )
    .leftJoin(
      santaPair,
      and(eq(event.id, santaPair.eventId), eq(santaPair.giverId, userId))
    )
    .leftJoin(user, eq(santaPair.receiverId, user.id))
    .orderBy(desc(event.eventDate))

  return events
}
