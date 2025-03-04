import { redirect } from "next/navigation"
import { Trash } from "lucide-react"

import {
  deleteEvent,
  EditableEventDetails,
  updateEvent,
} from "@/server/actions/event"
import { getEvent, OrganizerViewEvent } from "@/server/queries/event"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CopyButton } from "@/components/copy-button"
import { EventForm } from "@/components/event-detail-form"

/**
 * @param params - { eventId } that we want to view the details of
 * If the user accessing this page is the organizer, they also have the ability to edit or delete the event.
 */
export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  // Fetch the details for the specific event
  const { eventId } = await params
  const { eventInfo, isOrganizer } = await getEvent(eventId)

  // UI depends on whether the user is the organizer of the event. If they are,
  // they can manage the event. Otherwise, they can only view the details.
  const ui_parts = isOrganizer
    ? {
        heading: "Manage Event",
        content: <ManageEventPage {...eventInfo} />,
      }
    : {
        heading: "Event Details",
        content: (
          <Card>
            <CardContent className="p-6 space-y-4">
              EVENT DETAILS HERE ...
            </CardContent>
          </Card>
        ),
      }

  return (
    <main className="max-w-3xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{ui_parts.heading}</h1>
      </div>
      {ui_parts.content}
    </main>
  )
}

async function ManageEventPage(event: OrganizerViewEvent) {
  const { details, participants } = event
  // Handle edit event form submission
  const handleFormSubmit = async (data: EditableEventDetails) => {
    "use server" // can't pass callbacks to client components
    updateEvent(details.id, data) // Update the event details
  }

  // Handle delete button click
  const handleDelete = async () => {
    "use server"
    deleteEvent(details.id)
    redirect("/") // Redirects after form submission
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* The form data only includes the fields that should be edited*/}
          <EventForm
            initialValues={{
              name: details.name,
              location: details.location,
              description: details.description ?? "",
              budget: details.budget,
              eventDate: details.eventDate,
              drawDate: details.drawDate,
            }}
            submitButtonText="Save Changes"
            handleSubmit={handleFormSubmit}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Join Code</CardTitle>
          <CardDescription>
            Share this code with participants to join your event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md font-mono text-lg">
              {details.joinCode}
            </div>
            <CopyButton text={details.joinCode} className="ml-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {participants.map((p) => (
              <li key={p.participant.id}>{p.participant.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Button variant="destructive" onClick={handleDelete}>
        <Trash className="w-4 h-4" />
        Delete Event
      </Button>
    </div>
  )
}
