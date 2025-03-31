"use client"

import { redirect } from "next/navigation"
import { Trash } from "lucide-react"

import { leaveEvent } from "@/server/actions/event"
import { ParticipantViewEvent } from "@/server/queries/event"
import { getProfile } from "@/server/queries/profile"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserInfoCard } from "@/components/user-profile-card"

export default async function EventDetailPage(event: ParticipantViewEvent) {
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

  // get details about the organizer
  const organizerDetails = await getProfile(
    "my_event_organizer",
    event.details.organizerId
  )

  // Handle delete button click
  const handleLeave = () => {
    leaveEvent(event.details.id)
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
        <UserInfoCard {...organizerDetails} />
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
                Delete Event
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this event?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will delete the event and
                  all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLeave}
                  className={buttonVariants({
                    variant: "destructive",
                  })}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </Card>
  )
}
