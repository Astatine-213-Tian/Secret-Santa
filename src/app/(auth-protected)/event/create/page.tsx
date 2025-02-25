"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { createEvent } from "@/server/actions/event"
import { buttonVariants } from "@/components/ui/button"
import { EventForm, formSchema } from "../eventForm"

export default function CreateEventPage() {
  const router = useRouter()

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    // Create the event and navigate to the event management page
    const eventId = await createEvent(data)
    router.push(`/event/${eventId}}`) // TODO: should we do this? or redirect to the home page?
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Event</h1>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "mt-4")}
        >
          Back
        </Link>
      </div>
      <EventForm handleSubmit={handleSubmit} submitButtonText="Create Event" />
    </main>
  )
}
