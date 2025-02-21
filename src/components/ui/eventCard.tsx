"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  title: string;
  date: string;
  participants: number;
  budget: number;
  drawDate: string;
  onManage?: () => void;
}

export default function EventCard() {
  return (
    <Card className="p-6">
      <CardContent className="p-0 space-y-2">
        <h2 className="text-2xl font-bold">Office Secret Santa 2024</h2>
        <p>Dec 25, 2024</p>
        <p>12 participants</p>
        <p>Budget: $25</p>
        <p>Draw: Dec 1, 2024</p>
        <Button className="w-full mt-4 bg-[#0f172a] text-white hover:bg-[#1e293b]">
          Manage
        </Button>
      </CardContent>
    </Card>
  );
}

// Example usage:
/*
<EventCard
  title="Office Secret Santa 2024"
  date="Dec 25, 2024"
  participants={12}
  budget={25}
  drawDate="Dec 1, 2024"
  onManage={() => {
    // Handle manage action
  }}
/>
*/
