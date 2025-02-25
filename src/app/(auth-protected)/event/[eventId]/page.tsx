import { revalidatePath } from "next/cache"
import Link from "next/link"
import { redirect } from "next/navigation"

import { cn } from "@/lib/utils"
import {
  deleteEvent,
  EditableEventDetails,
  updateEvent,
} from "@/server/actions/event"
import { getEvent } from "@/server/queries/event"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EventForm } from "../eventForm"

// TODO: only submit form if data was changed
export default async function ManageEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  // Fetch the details for the specific event
  const { eventId } = await params
  const details = await getEvent(eventId).catch(() => null)

  const handleFormSubmit = async (data: EditableEventDetails) => {
    "use server" // can't pass callbacks to client components
    updateEvent(eventId, data) // Update the event details
    revalidatePath("/") // Redirect to the home page
  }

  const handleDelete = async () => {
    "use server"
    deleteEvent(eventId)
    redirect("/") // Redirects after form submission
  }

  if (!details) {
    return <div>Event not found</div>
  }

  const formData: EditableEventDetails = {
    name: details.name,
    location: details.location,
    description: details.description ?? "",
    budget: details.budget,
    eventDate: details.eventDate,
    drawDate: details.drawDate,
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Event</h1>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "mt-4")}
        >
          Back
        </Link>
      </div>

      <div className="flex space-x-4 mb-6">
        <Button className="bg-red-500" onClick={handleDelete}>
          Delete Event
        </Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <EventForm
            startValue={formData}
            submitButtonText="Save Changes"
            handleSubmit={handleFormSubmit}
          />
        </CardContent>
      </Card>
    </main>
  )
}
