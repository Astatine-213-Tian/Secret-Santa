"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { createEvent } from "@/server/actions/event"
import { Button } from "@/components/ui/button"

export interface Event {
  id: string
  name: string
  date: string
  location: string
  description: string
}

const addDays = (date: Date, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

export default function CreateEventPage() {
  const router = useRouter()
  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    budget: 0,
    eventDate: addDays(new Date(), 3),
    drawDate: addDays(new Date(), 2),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const eventId = await createEvent(eventData)
    router.push(`/event/${eventId}}`)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEventData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Event</h1>
        <Button onClick={() => router.back()}>Back</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2">
            Event Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={eventData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        <Button type="submit">Create Event</Button>
      </form>
    </main>
  )
}
