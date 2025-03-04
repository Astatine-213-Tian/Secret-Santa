import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function GiftsPage() {
  // TODO: dummy gifts data, connect to be later
  const gifts = [
    {
      event: "Event 1",
      user: "User 1",
    },
    {
      event: "Event 2",
      user: "User 2",
    },
  ]

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-semibold text-gray-800">Secret Friends</h1>
      <h2 className="font-medium text-muted-foreground">
        See who you are assigned to be a secret friend for.
      </h2>
      <div className="grid mt-6 grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
        {gifts.map((gift, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{gift.event}</CardTitle>
              <CardDescription>{gift.user}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
