"use client"

import { useState } from "react"
import { CirclePlus } from "lucide-react"
import { toast } from "sonner"

import { joinEvent } from "@/server/actions/event"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Input } from "./ui/input"

export const JoinEvent = () => {
  const [open, setOpen] = useState(false)

  const handleJoinEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const joinCode = formData.get("join-code") as string
    const result = await joinEvent({ joinCode })
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Event joined successfully")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CirclePlus className="w-4 h-4" />
          Join New Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Event</DialogTitle>
          <DialogDescription>
            Ask your event organizer for the 6-digit join code to join the
            event.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleJoinEvent} className="space-y-4">
          <Input placeholder="xxxxxx" name="join-code" maxLength={6} />
          <Button type="submit" className="w-full">
            Join Event
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
