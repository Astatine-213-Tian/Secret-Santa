"use client"

import moment from "moment"
import { Calendar, momentLocalizer } from "react-big-calendar"

import "react-big-calendar/lib/css/react-big-calendar.css"

import { redirect } from "next/navigation"

const localizer = momentLocalizer(moment)

interface Event {
  eventId: string
  name: string
  eventDate: Date
  location: string
  drawCompleted?: boolean
  budget?: number
  secretFriend?: string
}

const EventCard = ({ event }: { event: Event }) => {
  return <div>{event.name}</div>
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
  const events = joinedEvents.concat(organizedEvents)

  // redirect to event page on click
  const handleSelectEvent = (event: Event) => {
    redirect(`/dashboard/events/${event.eventId}`)
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Events Calendar
      </h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="eventDate"
        endAccessor="eventDate"
        // Height for the calendar container
        style={{ height: 500 }}
        // Called when an existing event is clicked
        onSelectEvent={handleSelectEvent}
        // Replace the default event rendering with our custom component
        components={{
          event: EventCard,
        }}
      />
    </div>
  )
}
