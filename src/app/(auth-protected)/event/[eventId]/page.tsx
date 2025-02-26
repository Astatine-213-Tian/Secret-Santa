import { redirect } from "next/navigation"

import {
  deleteEvent,
  EditableEventDetails,
  updateEvent,
} from "@/server/actions/event"
import { EventSchema } from "@/server/db/schema"
import { getEvent } from "@/server/queries/event"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  const { details, isOrganizer } = await getEvent(eventId)

  // UI depends on whether the user is the organizer of the event. If they are,
  // they can manage the event. Otherwise, they can only view the details.
  const ui_parts = isOrganizer
    ? {
        heading: "Manage Event",
        content: <ManageEventPage {...details} />,
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
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{ui_parts.heading}</h1>
      </div>
      {ui_parts.content}
    </main>
  )
}

// TODO: only submit form if data was changed
async function ManageEventPage(details: EventSchema) {
  // Handle edit event form submission
  const handleFormSubmit = async (data: EditableEventDetails) => {
    "use server" // can't pass callbacks to client components
    updateEvent(details.id, data) // Update the event details
    redirect("/") // Redirect to the home page
  }

  // Handle delete button click
  const handleDelete = async () => {
    "use server"
    deleteEvent(details.id)
    redirect("/") // Redirects after form submission
  }

  return (
    <>
      <div className="flex space-x-4 mb-6">
        <Button className="bg-red-500" onClick={handleDelete}>
          Delete Event
        </Button>
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          {/* The form data only includes the fields that should be edited*/}
          <EventForm
            startValue={{
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
    </>
  )
}
