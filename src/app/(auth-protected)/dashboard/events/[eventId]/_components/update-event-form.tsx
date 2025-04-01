"use client"

import { z } from "zod"

import { updateEvent } from "@/server/actions/event"
import { OrganizerViewEvent } from "@/server/queries/event"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventForm } from "@/components/event-detail-form"
import { eventDetailsSchema } from "@/schemas/event"

const UpdateEventForm = (details: OrganizerViewEvent["details"]) => {
  // Handle edit event form submission
  const handleFormSubmit = async (data: z.infer<typeof eventDetailsSchema>) => {
    updateEvent(details.id, data) // Update the event details
  }

  return (
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
          }}
          submitButtonText="Save Changes"
          handleSubmit={handleFormSubmit}
        />
      </CardContent>
    </Card>
  )
}

export default UpdateEventForm
