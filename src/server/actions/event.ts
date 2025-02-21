"use server"

import { revalidatePath } from "next/cache"
import { and, eq } from "drizzle-orm"

import { getUserId } from "@/lib/auth/auth-server"
import { db } from "../db"
import { event, eventJoinCode, eventParticipant } from "../db/schema"

interface CreateEventProps {
  name: string
  description: string
  budget: number
  eventDate: Date
  drawDate: Date
  location: string
}

export async function createEvent({
  name,
  description,
  budget,
  eventDate,
  drawDate,
  location,
}: CreateEventProps) {
  const userId = await getUserId()

  const newEvent = await db
    .insert(event)
    .values({
      name,
      description,
      budget,
      eventDate,
      drawDate,
      location,
      organizerId: userId,
    })
    .returning({ id: event.id })

  await db.insert(eventJoinCode).values({
    eventId: newEvent[0]!.id,
  })

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
