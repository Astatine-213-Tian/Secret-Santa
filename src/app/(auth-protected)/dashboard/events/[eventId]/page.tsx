import { getEventInfo } from "@/server/queries/event"
import EventDetailPage from "./event-detail-page"
import ManageEventPage from "./manage-event-page"

/**
 * @param params - { eventId } that we want to view the details of
 * If the user accessing this page is the organizer, they also have the ability to edit or delete the event.
 */
export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  // Fetch the details for the specific event
  const { eventId } = await params
  const { eventInfo, role } = await getEventInfo(eventId)

  // UI depends on whether the user is the organizer of the event. If they are,
  // they can manage the event. Otherwise, they can only view the details.

  return (
    <div>
      {role === "organizer" ? (
        <ManageEventPage {...eventInfo} />
      ) : (
        <EventDetailPage {...eventInfo} />
      )}
    </div>
  )
}
