"use server"

import { revalidatePath } from "next/cache"
import { and, eq, ne } from "drizzle-orm"
import { normalizeEmail } from "validator"

import { getUserInfo } from "@/lib/auth/auth-server"
import { db } from "../db"
import { event, eventParticipant, invitation, user } from "../db/schema"

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

  // invitation does not exist, create a new one
  const newInvitation = await db
    .insert(invitation)
    .values({
      eventId: eventId,
      email: email,
      normalizedEmail: normalizedEmail,
    })
    .onConflictDoNothing()
    .returning()

  if (newInvitation.length === 0) {
    return { error: "Invitation already exists" }
  }

  // TODO: send the invitation link to the participant
  const invitationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/invitation/${newInvitation[0]!.token}`
  console.log("invitationLink", invitationLink)

  revalidatePath(`/dashboard/events/${eventId}`)
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

  if (result.status === "accepted") {
    return { error: "Invitation already accepted" }
  } else if (result.status === "rejected") {
    return { error: "Invitation already rejected" }
  }

  await db.transaction(async (tx) => {
    await tx
      .update(invitation)
      .set({
        status: "accepted",
        updatedAt: new Date(),
      })
      .where(eq(invitation.token, token))

    await tx.insert(eventParticipant).values({
      eventId: result.eventId,
      userId: userId,
    })
  })

  return { success: "Invitation accepted" }
}

// soft delete the invitation
export async function revokeInvitation(eventId: string, email: string) {
  await checkOrganizer(eventId)

  const normalizedEmail = normalizeEmail(email)
  if (!normalizedEmail) {
    throw new Error("Invalid email")
  }

  await db
    .update(invitation)
    .set({
      revoked: true,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(invitation.eventId, eventId),
        eq(invitation.normalizedEmail, normalizedEmail)
      )
    )

  revalidatePath(`/dashboard/events/${eventId}`)
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
        eq(invitation.revoked, false),
        ne(invitation.status, "accepted")
      )
    )
    .returning()

  const token = result[0]!.token
  if (!token) {
    throw new Error("Invitation not found")
  }

  // TODO: send the invitation link to the participant
  const invitationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/invitation/${token}`
  console.log("invitationLink", invitationLink)

  revalidatePath(`/dashboard/events/${eventId}`)
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
