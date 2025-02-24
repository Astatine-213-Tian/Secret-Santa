import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { CirclePlus } from "lucide-react"

import { auth } from "@/lib/auth/auth-server"
import { cn } from "@/lib/utils"
import { getJoinedEvents, getOrganizedEvents } from "@/server/queries/event"
import { buttonVariants } from "@/components/ui/button"
import CardGrid from "@/components/card-grid"
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

          <Link
            href="/event/create"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <CirclePlus className="w-4 h-4" />
            Create New Event
          </Link>
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
