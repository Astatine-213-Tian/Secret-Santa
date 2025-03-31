"use client"

import { useState } from "react"
import Link from "next/link"

import { AccessModeMap, getProfile } from "@/server/queries/profile"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UserInfoCard } from "./user-profile-card"

interface AssigmentParams {
  event: {
    id: string
    name: string
  }
  assignee:
    | "secret"
    | {
        id: string
        name: string
      }
}

/**
 * Display information about an assigment.
 * Links to details about both: gift-receiver (User), event-details (Event)
 * @param assignee_details not specified if its a secret
 */
export function AssigmentCard(assigment: AssigmentParams) {
  const [receiverProfileData, setReceiverProfileData] = useState<
    AccessModeMap["my_gift_receiver"] | null
  >(null)

  // If undefined, it means it's a secret.
  const assignee =
    assigment.assignee === "secret"
      ? {
          id: "Secret",
          name: "Secret",
        }
      : assigment.assignee

  // When the user clicks the popover, fetch the user data.
  async function handleOpen() {
    if (!receiverProfileData) {
      const result = await getProfile("my_gift_receiver", assignee.id)
      setReceiverProfileData(result)
    }
  }

  return (
    <Card className="hover:scale-101  transition-transform duration-300">
      <CardHeader>
        <Popover>
          <PopoverTrigger
            disabled={assigment.assignee === "secret"}
            className={
              assigment.assignee === "secret"
                ? "w-[max-content]"
                : "w-[max-content] hover:font-bold duration-300"
            }
            onClick={handleOpen}
          >
            {assignee.name}
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <UserInfoCard {...receiverProfileData} />
          </PopoverContent>
        </Popover>
        <Link href={`/dashboard/events/${assigment.event.id}`}>
          {assigment.event.name}
        </Link>
      </CardHeader>
    </Card>
  )
}
