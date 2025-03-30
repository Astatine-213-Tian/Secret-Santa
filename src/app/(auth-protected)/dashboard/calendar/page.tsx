import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const [events, setEvents] = useState([
    {
      title: "Sample Event",
      start: new Date(),
      end: new Date(),
    },
  ]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const title = prompt("Enter event title:");
    if (title) {
      setEvents([...events, { start, end, title }]);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Events Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
      />
    </div>
  );
}
