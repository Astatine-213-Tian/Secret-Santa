import { getJoinedEvents, getOrganizedEvents } from "@/server/queries/event"
import EventCalendar from "@/components/event-calendar"

export default async function CalendarPage() {
  const joinedEvents = await getJoinedEvents()
  const organizedEvents = await getOrganizedEvents()

  return (
    <EventCalendar
      joinedEvents={joinedEvents}
      organizedEvents={organizedEvents}
    />
  )
}
