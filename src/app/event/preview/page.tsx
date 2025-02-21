"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function EventPreviewPage() {
  const searchParams = useSearchParams();

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Event Preview</h1>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold">{searchParams.get("name")}</h2>
          <div className="space-y-2">
            <p>
              <strong>Date:</strong> {searchParams.get("date")}
            </p>
            <p>
              <strong>Location:</strong> {searchParams.get("location")}
            </p>
            <p>
              <strong>Description:</strong> {searchParams.get("description")}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
