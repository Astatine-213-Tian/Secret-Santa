import Link from "next/link"
import { CircleDollarSign, Gift, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface JoinedEventCardProps {
  name: string
  eventId: string
  eventDate: Date
  location: string
  budget: number
  secretFriend: string
}

export const JoinedEventCard = ({
  name,
  eventDate,
  location,
  budget,
  secretFriend,
  eventId,
}: JoinedEventCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-lg mb-2">{name}</CardTitle>
        <p className="text-base font-medium text-gray-600">
          {eventDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-0">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            Location:&nbsp;
            <span className="font-medium">{location}</span>
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <CircleDollarSign className="w-4 h-4 mr-1" />
            Budget:&nbsp;
            <span className="font-medium">{budget}</span>
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Gift className="w-4 h-4 mr-1" />
            Secret Friend:&nbsp;
            <span className="font-medium">{secretFriend}</span>
          </p>
        </div>
        <Link
          href={`/events/${eventId}`}
          className={cn(buttonVariants({ variant: "default" }), "mt-4")}
        >
          View
        </Link>
      </CardContent>
    </Card>
  )
}
