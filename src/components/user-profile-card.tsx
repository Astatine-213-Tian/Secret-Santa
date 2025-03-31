"use client"

import { InferModel } from "drizzle-orm"
import { FileText, Gift, User } from "lucide-react"

import { GiftPreferences } from "@/lib/types"
import { user } from "@/server/db/schema"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar } from "./ui/avatar"

// Infer the user model and make all fields optional
// since it depends on the access mode used.

const TextItem = ({ title, val }: { title: string; val: string }) => (
  <div>
    <div className="font-bold">{title}</div>
    <div>{val}</div>
  </div>
)

function ProfileInfoCard(
  userInfo: Partial<{
    name: string
    email: string
    bio: string
    image: string
  }>
) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{userInfo.name}'s Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center mt-4">
            <Avatar src={userInfo.image} alt="" size={96} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {userInfo.name && <TextItem title="Name" val={userInfo.name} />}
              {userInfo.email && (
                <TextItem title="Email" val={userInfo.email} />
              )}
            </div>
            <div>
              {userInfo.bio && <TextItem title="Bio" val={userInfo.bio} />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function GiftPreferencesCard(prefs: GiftPreferences) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="likes">
          <TabsList className="mb-4">
            <TabsTrigger value="likes">
              <Gift className="h-4 w-4" />
              Likes & Dislikes
            </TabsTrigger>
            <TabsTrigger value="sizes">
              <User className="h-4 w-4" />
              Sizes & Allergies
            </TabsTrigger>
            <TabsTrigger value="additional">
              <FileText className="h-4 w-4" />
              Additional Info
            </TabsTrigger>
          </TabsList>
          <TabsContent value="likes" className="space-y-4">
            <TextItem title="Likes" val={prefs.likes} />
            <TextItem title="Dislikes" val={prefs.dislikes} />
          </TabsContent>
          <TabsContent value="sizes" className="space-y-4">
            <TextItem title="Sizes" val={prefs.sizes} />
            <TextItem title="Allergies" val={prefs.allergies} />
          </TabsContent>
          <TabsContent value="additional">
            <TextItem title="Additional Info" val={prefs.additionalInfo} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

/**
 * Displays (partial) User Info.
 * Many of the fields may not be present do to the access-mode specified
 * when fetching this information (server-side).
 */
export function UserInfoCard(userInfo: Partial<InferModel<typeof user>>) {
  return (
    <div>
      <ProfileInfoCard
        {...{
          name: userInfo.name,
          email: userInfo.email,
          bio: userInfo.bio ?? "",
          image: userInfo.image ?? "",
        }}
      />
      {userInfo.giftPreferences && (
        <GiftPreferencesCard {...userInfo.giftPreferences} />
      )}
    </div>
  )
}
