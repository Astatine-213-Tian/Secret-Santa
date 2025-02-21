"use client";

import React from "react";
import { useRouter } from "next/navigation";

import CardGrid from "@/components/ui/cardGrid";
import EventsSection from "@/components/ui/eventSection";

export default function DashboardPage() {
  const router = useRouter();

  const organizedEvents = [
    {
      id: 1,
      name: "Office Secret Santa 2024",
      date: "Dec 25, 2024",
      status: "Manage",
    },
    {
      id: 2,
      name: "Family Gift Exchange",
      date: "Dec 18, 2024",
      status: "Manage",
    },
    {
      id: 3,
      name: "Team Building Exchange",
      date: "Dec 15, 2024",
      status: "Manage",
    },
  ];

  const participatingEvents = [
    {
      id: 4,
      name: "Tech Team Gift Exchange",
      date: "Dec 22, 2024",
      status: "View",
    },
    {
      id: 5,
      name: "Book Club Secret Santa",
      date: "Dec 20, 2024",
      status: "View",
    },
    {
      id: 6,
      name: "Neighborhood Gift Swap",
      date: "Pending Draw",
      status: "View",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Secret Santa Dashboard</h1>
        <button
          onClick={() => router.push("/event/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Event
        </button>
      </div>

      {/* Cards Section */}
      <CardGrid />

      {/* Organized Events */}
      <EventsSection title="Events You Organize" events={organizedEvents} />

      {/* Participating Events */}
      <EventsSection
        title="Events You're Participating In"
        events={participatingEvents}
      />
    </main>
  );
}
