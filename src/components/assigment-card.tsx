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
import { Button } from "./ui/button"
import { UserInfoCard } from "./user-profile-card"

// Assigment is either: Receiver or Gifter (type of current user)

export function ReceiverAssigmentCard(assignment: {
  event: {
    id: string
    name: string
  }
  receiver: {
    id: string
    name: string
  }
}) {
  const [profileData, setProfileData] = useState<
    AccessModeMap["my_gift_receiver"] | null
  >(null)

  // When the user clicks the popover, fetch the user data.
  async function handleNameClick() {
    if (profileData) return
    const result = await getProfile("my_gift_receiver", assignment.receiver.id)
    setProfileData(result)
  }

  return (
    <Card className="flex items-center hover:scale-101  transition-transform duration-300">
      <CardHeader className="w-full">
        <Popover>
          <PopoverTrigger
            className="w-[max-content] hover:cursor-pointer"
            onClick={handleNameClick}
          >
            {assignment.receiver.name}
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <UserInfoCard {...profileData} />
          </PopoverContent>
        </Popover>
        <Link href={`/dashboard/events/${assignment.event.id}`}>
          {assignment.event.name}
        </Link>
      </CardHeader>
      <Button className="mr-4">Submit</Button>
    </Card>
  )
}

/**
 * Display information about an assigment.
 * Links to details about both: gift-receiver (User), event-details (Event)
 * @param assignee_details not specified if its a secret
 */
export function GifterAssigmentCard(assignment: {
  event: {
    id: string
    name: string
  }
  gifter?: {
    id: string
    name: string
  }
}) {
  const [profileData, setProfileData] = useState<
    AccessModeMap["my_gifter"] | null
  >(null)

  const isSecret = !assignment.gifter

  // If undefined, it means it's a secret.
  const gifter = !assignment.gifter
    ? {
        id: "Secret",
        name: "Secret",
      }
    : assignment.gifter

  // When the user clicks the popover, fetch the user data.
  async function handleNameClick() {
    if (profileData) return
    const result = await getProfile("my_gifter", gifter.id)
    setProfileData(result)
  }

  return (
    <Card className="flex items-center hover:scale-101  transition-transform duration-300">
      <CardHeader className="w-full">
        <Popover>
          <PopoverTrigger
            disabled={isSecret}
            className="w-[max-content] hover:cursor-pointer"
            onClick={handleNameClick}
          >
            {gifter.name}
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <UserInfoCard {...profileData} />
          </PopoverContent>
        </Popover>
        <Link href={`/dashboard/events/${assignment.event.id}`}>
          {assignment.event.name}
        </Link>
      </CardHeader>
      <Button className="mr-4" disabled={isSecret}>
        Reveal
      </Button>
    </Card>
  )
}
