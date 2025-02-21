"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ProfilePage() {
  // Dummy initial profile data – in a real app, fetch this from your API.
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    address: "123 Main Street, City, Country",
    giftPreferences: "Books, Gadgets",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // TODO: Save updated profile to backend with proper secure API call.
    console.log("Profile saved", profile);
    setEditMode(false);
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Manage your personal details and gift preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              {editMode ? (
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              ) : (
                <p>{profile.fullName}</p>
              )}
            </div>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              {editMode ? (
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>
            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              {editMode ? (
                <textarea
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              ) : (
                <p>{profile.address}</p>
              )}
            </div>
            {/* Gift Preferences */}
            <div>
              <label
                htmlFor="giftPreferences"
                className="block text-sm font-medium text-gray-700"
              >
                Gift Preferences
              </label>
              {editMode ? (
                <input
                  id="giftPreferences"
                  type="text"
                  name="giftPreferences"
                  value={profile.giftPreferences}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              ) : (
                <p>{profile.giftPreferences}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {editMode ? (
            <>
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
