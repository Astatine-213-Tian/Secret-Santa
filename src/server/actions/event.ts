"use server"

import { and, eq, gte } from "drizzle-orm"
import { z } from "zod"

import { getUserId } from "@/lib/auth/auth-server"
import { eventDetailsSchema } from "@/schemas/event"
import { db } from "../db"
import { event, eventParticipant } from "../db/schema"

export async function createEvent(ev: z.infer<typeof eventDetailsSchema>) {
  try {
    eventDetailsSchema.parse(ev)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.message }
    }
    throw error
  }

  const userId = await getUserId()

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

  const userId = await getUserId()

  await db
    .update(event)
    .set({
      name: ev.name,
      description: ev.description,
      budget: ev.budget,
      eventDate: ev.eventDate,
      drawDate: ev.drawDate,
      location: ev.location,
    })
    .where(and(eq(event.id, eventId), eq(event.organizerId, userId)))
}

export async function deleteEvent(eventId: string) {
  const userId = await getUserId()

  await db
    .delete(event)
    .where(and(eq(event.id, eventId), eq(event.organizerId, userId)))
}

interface JoinEventProps {
  joinCode: string
}

export async function joinEvent({ joinCode }: JoinEventProps) {
  const userId = await getUserId()

  const result = await db
    .select({
      id: event.id,
    })
    .from(event)
    .where(and(eq(event.joinCode, joinCode), gte(event.eventDate, new Date())))
    .limit(1)

  if (result.length === 0) {
    return { error: "Invalid join code" }
  }

  try {
    await db.insert(eventParticipant).values({
      eventId: result[0]!.id,
      userId: userId,
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return { error: "You've already joined this event" }
    }
    throw error
  }
}
