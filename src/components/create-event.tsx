"use client"

import { CirclePlus } from "lucide-react"

import { createEvent } from "@/server/actions/event"
import { Button } from "./ui/button"

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

export const CreateEvent = () => {
  // TODO: Remove this
  const defaultEventValues = {
    name: "New Event",
    description: "New Event Description",
    budget: 100,
    eventDate: addDays(new Date(), 7),
    drawDate: addDays(new Date(), 3),
    location: "New Event Location",
  }

  return (
    <Button variant="outline" onClick={() => createEvent(defaultEventValues)}>
      <CirclePlus className="w-4 h-4" />
      Create New Event
    </Button>
  )
}
