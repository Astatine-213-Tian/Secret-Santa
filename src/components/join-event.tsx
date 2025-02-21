"use client"

import { CirclePlus } from "lucide-react"
import { toast } from "sonner"

import { joinEvent } from "@/server/actions/event"
import { Button } from "./ui/button"

export const JoinEvent = () => {
  // TODO: Remove this
  const defaultJoinCode = "123456"

  const handleJoinEvent = async () => {
    const result = await joinEvent({ joinCode: defaultJoinCode })
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Event joined successfully")
    }
  }

  return (
    <Button variant="outline" onClick={handleJoinEvent}>
      <CirclePlus className="w-4 h-4" />
      Join New Event
    </Button>
  )
}
