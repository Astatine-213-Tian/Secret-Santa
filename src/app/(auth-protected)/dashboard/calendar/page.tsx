"use client"

import { useState } from "react"
import moment from "moment"
import { Calendar, momentLocalizer } from "react-big-calendar"

import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

export default function CalendarPage() {
  const router = useRouter()

  // 2) State holding the calendar events.
  // Include any extra fields you need, e.g. "description", "type", etc.
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Sample Event",
      start: new Date(),
      end: new Date(),
      description: "A short description of this event.",
      type: "organized", // or "joined"
    },
  ])

  // 3) Called when the user selects an empty slot (click or drag).
  // Prompts for a title, then creates a new event.
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = prompt("Enter event title:")
    if (title) {
      setEvents([...events, { starwt, end, title }])
    }
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
        components={{
          event: EventCard,
        }}
      />
    </div>
  )
}
