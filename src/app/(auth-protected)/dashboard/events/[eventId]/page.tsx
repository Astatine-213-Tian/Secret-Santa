import { getEventInfo } from "@/server/queries/event"
import { getProfile } from "@/server/queries/profile"
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

  if (role == "organizer") {
    return <ManageEventPage {...eventInfo} />
  }

  // get details about the organizer
  const organizerDetails = await getProfile(
    "my_event_organizer",
    eventInfo.details.organizerId
  )

  return <EventDetailPage event={eventInfo} organizer={organizerDetails} />
}
