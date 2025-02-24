import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth/auth-server"
import { getJoinedEvents, getOrganizedEvents } from "@/server/queries/event"
import CardGrid from "@/components/card-grid"
import { CreateEvent } from "@/components/create-event"
import { JoinEvent } from "@/components/join-event"
import { JoinedEventCard } from "@/components/joined-event-card"
import { OrganizedEventCard } from "@/components/organized-event-card"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const organizedEvents = await getOrganizedEvents()
  const joinedEvents = await getJoinedEvents()

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <CardGrid />
        <div className="flex items-center justify-between mb-6 mt-12">
          <h2 className="text-xl font-semibold text-gray-900">
            Events You're Organizing
          </h2>
          <CreateEvent />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizedEvents.map((event) => (
            <OrganizedEventCard key={event.eventId} {...event} />
          ))}
        </div>

        <div className="flex items-center justify-between mb-6 mt-12">
          <h2 className="text-xl font-semibold text-gray-900">
            Events You're Participating In
          </h2>
          <JoinEvent />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {joinedEvents.map((event) => (
            <JoinedEventCard key={event.eventId} {...event} />
          ))}
        </div>
      </div>
    </div>
  )
}
