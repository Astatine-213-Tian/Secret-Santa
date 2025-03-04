"use client"

import React from "react"
import Link from "next/link"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const cardData = [
  {
    title: "Your Gifts",
    description: "View your assignments",
    href: "/gifts",
  },
  {
    title: "Your Profile",
    description: "Edit your preferences",
    href: "/profile",
  },
  {
    title: "Join Event",
    description: "Enter an event code",
    href: "/event/join",
  },
  {
    title: "Calendar",
    description: "See upcoming events",
    href: "/calendar",
  },
]

export default function CardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
      {cardData.map((card, index) => (
        <Link href={card.href} key={index}>
          <Card>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}
