import { join } from "path"
import Link from "next/link"
import { Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { getJoinedEvents, getOrganizedEvents } from "@/server/queries/event"
import { buttonVariants } from "@/components/ui/button"
import { JoinedEventCard } from "@/components/joined-event-card"
import { OrganizedEventCard } from "@/components/organized-event-card"

export default async function EventsPage() {
  const organizedEvents = await getOrganizedEvents()
  const joinedEvents = await getJoinedEvents()

  console.log(joinedEvents)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-gray-800">Your Events</h1>
      <div className="flex items-center justify-between mt-6">
        <h2 className="text-xl font-semibold">Events You're Organizing</h2>

        <Link
          href="/events/create"
          className={cn(buttonVariants({ size: "lg" }), "px-6")}
        >
          <Plus className="w-4 h-4" />
          Create New Event
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizedEvents.map((event) => (
          <OrganizedEventCard key={event.eventId} {...event} />
        ))}
      </div>

      <div className="flex items-center justify-between mb-6 mt-12">
        <h2 className="text-xl font-semibold">Events You've Joined</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {joinedEvents.map((event) => (
          <JoinedEventCard key={event.eventId} {...event} />
        ))}
      </div>
    </div>
  )
}
