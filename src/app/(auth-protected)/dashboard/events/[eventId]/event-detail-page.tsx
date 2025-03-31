import { ParticipantViewEvent } from "@/server/queries/event"
import { getOtherUserProfile } from "@/server/queries/profile"
import { Avatar } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// TODO: create reusable 'ProfileView' component (to also use in SecretFriends page)
function OrganizerDetailsCard({
  email,
  name,
  avatarUrl,
}: {
  email: string
  name: string
  avatarUrl: string | null
}) {
  return (
    <div className="flex gap-4">
      <Avatar alt="OrganzierAvatar" src={avatarUrl} />
      <div>{name}</div>
      <div>{email}</div>
    </div>
  )
}

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

  const organizerDetails = await getOtherUserProfile(event.details.organizerId)

  // TODO: only display avatar, but show popup on click
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
        <OrganizerDetailsCard {...organizerDetails} />
      </CardContent>
    </Card>
  )
}
