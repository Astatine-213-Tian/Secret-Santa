"use client"

import { useEffect, useState } from "react"
import moment from "moment"
import { Calendar, momentLocalizer } from "react-big-calendar"

import "react-big-calendar/lib/css/react-big-calendar.css"

import { redirect } from "next/navigation"

const localizer = momentLocalizer(moment)

interface Event {
  eventId: string
  name: string
  eventDate: Date
  location: Date
  drawCompleted?: boolean
  budget?: number
  secretFriend?: string
}

export default function EventCalendar({
  joinedEvents,
  organizedEvents,
}: {
  joinedEvents: Event[]
  organizedEvents: Event[]
}) {
  // 2) State holding the calendar events.
  // Include any extra fields you need, e.g. "description", "type", etc.
  const [events, setEvents] = useState([
    {
      id: "id",
      title: "Sample Event",
      start: new Date(),
      end: new Date(),
      description: "A short description of this event.",
      type: "organized", // or "joined"
    },
  ])

  // fetch user events on mount
  useEffect(() => {
    const joined = joinedEvents.map((event) => ({
      id: event.eventId,
      title: event.name,
      start: event.eventDate,
      end: event.eventDate,
      description: `Prepare a ${event.budget} gift for ${event.secretFriend} at ${event.location}`,
      type: "joined",
    }))
    const organized = organizedEvents.map((event) => ({
      id: event.eventId,
      title: event.name,
      start: event.eventDate,
      end: event.eventDate,
      description: `Organized event at ${event.location}`,
      type: "organized",
    }))
    setEvents([...joined, ...organized])
  }, [])

  // 3) Called when the user selects an empty slot (click or drag).
  // Prompts for a title, then creates a new event.
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = prompt("Enter event title:")
    if (title) {
      setEvents([...events, { starwt, end, title }])
    }
  }

  // redirect to event page on click
  const handleSelectEvent = (event) => {
    redirect(`/dashboard/events/${event.id}`)
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Events Calendar
      </h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        // Height for the calendar container
        style={{ height: 500 }}
        // Allows users to select empty slots to create new events
        selectable
        onSelectSlot={handleSelectSlot}
        // Called when an existing event is clicked
        onSelectEvent={handleSelectEvent}
        // Replace the default event rendering with our custom component
        // components={{
        //   event: EventCard,
        // }}
      />
    </div>
  )
}
