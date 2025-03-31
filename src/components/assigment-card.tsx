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

/**
 * Links to details about both: gift-receiver (User), event-details (Event)
 */
export function AssigmentCard(assigment: {
  event: {
    id: string
    name: string
  }
  receiver: {
    id: string
    name: string
  }
}) {
  const [receiverProfileData, setReceiverProfileData] = useState<
    AccessModeMap["my_gift_receiver"] | null
  >(null)

  // When the user clicks the popover, fetch the user data.
  async function handleOpen() {
    if (!receiverProfileData) {
      const result = await getProfile("my_gift_receiver", assigment.receiver.id)
      setReceiverProfileData(result)
    }
  }

  return (
    <Card className="hover:scale-101  transition-transform duration-300">
      <CardHeader>
        <Popover>
          <PopoverTrigger
            className="w-[max-content] hover:font-bold duration-300"
            onClick={handleOpen}
          >
            {assigment.receiver.name}
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <UserInfoCard {...receiverProfileData} />
          </PopoverContent>
        </Popover>
        <CardDescription>{assigment.event.name}</CardDescription>
      </CardHeader>
    </Card>
  )
}
