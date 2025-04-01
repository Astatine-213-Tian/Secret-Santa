import "server-only"

import { notFound } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "../db"
import { invitation } from "../db/schema"

/**
 * Get the invitation data for the given token
 * Only returns the invitation data if the invitation is not revoked and in pending state
 * @param token - The token of the invitation
 * @returns The invitation data
 */
export const getInvitationData = async (token: string) => {
  const invitationData = await db.query.invitation.findFirst({
    where: and(eq(invitation.token, token), eq(invitation.revoked, false)),
    with: {
      event: {
        with: {
          organizer: {
            columns: {
              name: true,
            },
          },
        },
        columns: {
          name: true,
          description: true,
          eventDate: true,
          location: true,
          budget: true,
        },
      },
    },
    columns: {
      token: true,
    },
  })

  if (!invitationData) {
    notFound()
  }

  return invitationData
}
