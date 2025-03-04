"use client"

import { toast } from "sonner"

import { joinEvent } from "@/server/actions/event"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// TODO: placeholder, add function
// probably keep consistent with join button in card grid
export default function JoinPage() {
  const handleJoinEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const joinCode = formData.get("join-code") as string
    const result = await joinEvent({ joinCode })
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Event joined successfully")
    }
  }

  return (
    <main className="mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Join Event</CardTitle>
          <CardDescription>
            Ask your event organizer for the 6-digit join code to join the
            event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinEvent} className="space-y-4">
            <Input placeholder="xxxxxx" name="join-code" maxLength={6} />
            <Button type="submit" className="w-full">
              Join Event
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
