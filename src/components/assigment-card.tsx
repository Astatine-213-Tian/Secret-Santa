"use client"

import Link from "next/link"

import { Card, CardDescription, CardHeader } from "@/components/ui/card"

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
  return (
    <Card className="hover:scale-101  transition-transform duration-300">
      <CardHeader>
        <Link
          className="hover:underline"
          href={`/profiles/${assigment.receiver.id}`}
        >
          {assigment.receiver.name}
        </Link>
        <CardDescription>{assigment.event.name}</CardDescription>
      </CardHeader>
    </Card>
  )
}
