"use client"

import { useState } from "react"

import { AccessModeMap, getProfile } from "@/server/queries/profile"
import { Card, CardDescription, CardHeader } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UserInfoCard } from "./user-profile-card"

interface AssignmentParams {
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
 * Display information about an assignment.
 * Links to details about both: gift-receiver (User), event-details (Event)
 * @param assignee_details not specified if its a secret
 */
export function AssignmentCard(assignment: AssignmentParams) {
  const [receiverProfileData, setReceiverProfileData] = useState<
    AccessModeMap["my_gift_receiver"] | null
  >(null)

  // If undefined, it means it's a secret.
  const assignee =
    assignment.assignee === "secret"
      ? {
          id: "Secret",
          name: "Secret",
        }
      : assignment.assignee

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
            disabled={assignment.assignee === "secret"}
            className={
              assignment.assignee === "secret"
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
        <CardDescription>{assignment.event.name}</CardDescription>
      </CardHeader>
    </Card>
  )
}
