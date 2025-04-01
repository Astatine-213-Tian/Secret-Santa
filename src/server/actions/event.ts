"use server"

import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { getUserInfo } from "@/lib/auth/auth-server"
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
