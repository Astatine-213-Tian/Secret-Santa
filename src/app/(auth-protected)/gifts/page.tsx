"use client"

import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function GiftsPage() {
  // TODO: dummy gifts data, connect to be later
  const [gifts, setGifts] = useState([
    {
      event: "Event 1",
      user: "User 1",
    },
    {
      event: "Event 2",
      user: "User 2",
    },
  ])

  return (
    <main className="mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gifts</CardTitle>
          <CardDescription>See what gifts you are assigned to.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
            {gifts.map((gift, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{gift.event}</CardTitle>
                  <CardDescription>{gift.user}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
