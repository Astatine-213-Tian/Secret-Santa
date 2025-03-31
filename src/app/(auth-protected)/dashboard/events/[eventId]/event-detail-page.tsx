import { ParticipantViewEvent } from "@/server/queries/event"
import { getProfile } from "@/server/queries/profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserInfoCard } from "@/components/user-profile-card"

export default async function EventDetailPage(event: ParticipantViewEvent) {
  // Helper to easily map to UI elements
  const event_details = [
    {
      title: "Name",
      value: event.details.name,
    },
    {
      title: "Description",
      value: event.details.description,
    },
    {
      title: "Date/Time",
      value: event.details.eventDate.toLocaleString(),
    },
    {
      title: "Location",
      value: event.details.location,
    },
  ]

  // get details about the organizer
  const organizerDetails = await getProfile(
    "my_event_organizer",
    event.details.organizerId
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {event_details.map(({ title, value }) => (
          <div className="space-y-3" key={title}>
            <div className="font-bold">{title}</div>
            <div>{value}</div>
          </div>
        ))}
        <div className="font-bold">Organizer</div>
        <UserInfoCard {...organizerDetails} />
      </CardContent>
    </Card>
  )
}
