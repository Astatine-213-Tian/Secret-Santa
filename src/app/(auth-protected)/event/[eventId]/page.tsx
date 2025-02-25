import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const dummyEvent = {
  name: "Event 1",
  date: "2024-01-01",
  location: "Location 1",
  description: "Description 1",
}

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params
  // TODO: get event from db
  const { name, date, location, description } = dummyEvent

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Event Details</h1>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "mt-4")}
        >
          Back
        </Link>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">{name}</h2>
          <div className="space-y-2">
            <p>
              <strong>Date:</strong> {date}
            </p>
            <p>
              <strong>Location:</strong> {location}
            </p>
            <p>
              <strong>Description:</strong> {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
