import Link from "next/link"
import { CalendarClock, Hash, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface OrganizedEventCardProps {
  name: string
  eventId: string
  eventDate: Date
  location: string
  participantsNum: number
  drawDate: Date
}

export const OrganizedEventCard = ({
  name,
  eventId,
  eventDate,
  location,
  participantsNum,
  drawDate,
}: OrganizedEventCardProps) => {
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
            <Hash className="w-4 h-4 mr-1" />
            <span className="font-medium">{participantsNum}</span>
            &nbsp;participants
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            Location:&nbsp;
            <span className="font-medium">{location}</span>
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <CalendarClock className="w-4 h-4 mr-1" />
            Draw Date:&nbsp;
            <span className="font-medium">
              {drawDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
        <Link
          href={`/events/${eventId}`}
          className={cn(buttonVariants({ variant: "default" }), "mt-4")}
        >
          Manage
        </Link>
      </CardContent>
    </Card>
  )
}
