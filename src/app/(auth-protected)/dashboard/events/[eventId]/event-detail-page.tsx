"use client"

import { redirect } from "next/navigation"
import { Trash } from "lucide-react"

import { removeSelfFromEvent } from "@/server/actions/participant"
import { ParticipantViewEvent } from "@/server/queries/event"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserInfoCard } from "@/components/user-profile-card"

export default function EventDetailPage(params: {
  event: ParticipantViewEvent
  organizer: {
    id: string
    name: string
    email: string
    image: string | null
  }
}) {
  const { event, organizer } = params

  // Helper to easily map to UI elements
  const event_details = [
    {
      title: "Name",
      value: event.details.name,
    },
    {
      title: "Description",
      value: event.details.description,
    },
    {
      title: "Date/Time",
      value: event.details.eventDate.toLocaleString(),
    },
    {
      title: "Location",
      value: event.details.location,
    },
  ]

  // Handle delete button click
  const handleLeave = () => {
    removeSelfFromEvent(event.details.id)
    redirect("/") // Redirects after form submission
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {event_details.map(({ title, value }) => (
          <div className="space-y-3" key={title}>
            <div className="font-bold">{title}</div>
            <div>{value}</div>
          </div>
        ))}
        <div className="font-bold">Organizer</div>
        <UserInfoCard {...organizer} />
      </CardContent>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="w-4 h-4" />
                Leave Event
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to leave this event?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLeave}
                  className={buttonVariants({
                    variant: "destructive",
                  })}
                >
                  Leave
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </Card>
  )
}
