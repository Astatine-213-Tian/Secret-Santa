import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useRouter } from "next/router"; // For Next.js routing
import "react-big-calendar/lib/css/react-big-calendar.css";

// 1) Use momentLocalizer so react-big-calendar can parse/manipulate dates.
const localizer = momentLocalizer(moment);

/**
 * A custom component to render each event cell in the calendar.
 * You can expand it to show more data (like type, organizer, etc.).
 */
function EventCard({ event }: { event: any }) {
  return (
    <div style={{ padding: "2px" }}>
      <strong>{event.title}</strong>
      {/* If you want to display more info here, uncomment:
      <div>{event.description}</div>
      */}
    </div>
  );
}

export default function CalendarPage() {
  const router = useRouter();

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
  ]);

  // 3) Called when the user selects an empty slot (click or drag).
  // Prompts for a title, then creates a new event.
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = prompt("Enter event title:");
    if (title) {
      const newEvent = {
        id: events.length + 1,
        title,
        start,
        end,
        description: `Description for “${title}”`, // or ask for description in the prompt
        type: "joined", // or "organized"
      };
      setEvents([...events, newEvent]);
    }
  };

  // 4) Called when the user clicks on an existing event.
  // Navigates to a detail page (e.g., /events/[id]).
  const handleSelectEvent = (event: any) => {
    // Adjust this URL to match your routing structure
    router.push(`/events/${event.id}`);
  };

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
  );
}
