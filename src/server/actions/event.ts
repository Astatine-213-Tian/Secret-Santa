"use server"

import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"

import { getUserId } from "@/lib/auth/auth-server"
import { db } from "../db"
import { event, eventJoinCode, eventParticipant } from "../db/schema"

export interface EditableEventDetails {
  name: string
  location: string
  description: string
  budget: number
  eventDate: Date
  drawDate: Date
}

export async function createEvent(ev: EditableEventDetails) {
  const userId = await getUserId()

  const newEvent = await db
    .insert(event)
    .values({
      ...ev,
      organizerId: userId,
    })
    .returning({ id: event.id })

  const eventId = newEvent[0]!.id

  await db.insert(eventJoinCode).values({
    eventId,
  })

  revalidatePath("/")

  return eventId
}

export async function updateEvent(eventId: string, ev: EditableEventDetails) {
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

  revalidatePath("/")
}

export async function deleteEvent(eventId: string) {
  const userId = await getUserId()

  await db
    .delete(event)
    .where(and(eq(event.id, eventId), eq(event.organizerId, userId)))

  revalidatePath("/")
}

interface JoinEventProps {
  joinCode: string
}

export async function joinEvent({ joinCode }: JoinEventProps) {
  const userId = await getUserId()

  const event = await db
    .select({
      id: eventJoinCode.eventId,
    })
    .from(eventJoinCode)
    .where(
      and(eq(eventJoinCode.code, joinCode), eq(eventJoinCode.isValid, true))
    )
    .limit(1)

  if (event.length === 0) {
    return { error: "Invalid join code" }
  }

  try {
    await db.insert(eventParticipant).values({
      eventId: event[0]!.id,
      userId: userId,
    })
  } catch (error) {
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return { error: "You've already joined this event" }
    }
    throw error
  }

  revalidatePath("/")
}
