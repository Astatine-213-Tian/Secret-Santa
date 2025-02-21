"use client";
import React from "react";
import EventCard from "./eventCard";

interface Event {
  id: number;
  name: string;
  date: string;
  status: string;
}

interface EventsSectionProps {
  title: string;
  events: Event[];
}

export default function EventsSection({ title, events }: EventsSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
