"use client"

import { Trash } from "lucide-react"

import { ParticipantViewEvent } from "@/server/queries/event"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
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

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {event_details.map(({ title, value }) => (
            <div className="space-y-3" key={title}>
              <div className="font-bold">{title}</div>
              <div>{value}</div>
            </div>
          ))}
          <div className="font-bold">Organizer</div>
          <UserInfoCard {...organizer} />
        </CardContent>
      </Card>
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
                  Please contact your Organizer to leave the event.
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
