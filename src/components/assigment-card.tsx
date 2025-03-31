"use client"

import { redirect } from "next/navigation"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function AssigmentCard(assigment: {
  event: {
    id: string
    name: string
  }
  receiver: {
    id: string
    name: string
  }
}) {
  const onUserClick = (userId: string) => {
    // Go to the user's profile page
    redirect(`/profiles/${userId}`)
  }

  return (
    <Card className="hover:scale-101  transition-transform duration-300">
      <CardHeader>
        <CardTitle
          className="hover:underline bg-red"
          onClick={() => onUserClick(assigment.receiver.id)}
        >
          {assigment.receiver.name}
        </CardTitle>
        <CardDescription>{assigment.event.name}</CardDescription>
      </CardHeader>
    </Card>
  )
}
