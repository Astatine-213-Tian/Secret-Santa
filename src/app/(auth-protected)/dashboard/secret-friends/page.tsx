// "use client"
import { fetchUserAssigments } from "@/server/queries/event"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function GiftsPage() {
  const userAssigments = await fetchUserAssigments()

  const noGiftsMsg =
    "You are not assigned to anybody yet. Try joining an event!"

  // TODO: on click, expand the card to show links for: User profile & Event Details page
  // const onGiftCardClick = (gift: unknown) => {};

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-semibold text-gray-800">Secret Friends</h1>
      <h2 className="font-medium text-muted-foreground">
        See who you are assigned to be a secret friend for.
      </h2>
      <div className="grid mt-6 grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
        {!userAssigments ? (
          <div>{noGiftsMsg}</div>
        ) : (
          userAssigments.map((assigment, idx) => (
            <Card
              key={idx}
              className="hover:scale-101  transition-transform duration-300"
            >
              <CardHeader>
                <CardTitle>{assigment.receiver.name}</CardTitle>
                <CardDescription>{assigment.event.name}</CardDescription>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
