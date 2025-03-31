import { getProfile } from "@/server/queries/profile"
import { UserProfileForm } from "@/components/user-profile-form"

/**
 *
 * @returns
 */
export default async function ProfilePage() {
  const profile = await getProfile("my_profile")

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-gray-800">Your Profile</h1>
      <UserProfileForm
        name={profile.name}
        email={profile.email}
        avatarUrl={profile.image}
        bio={profile.bio ?? ""}
        giftPreferences={
          profile.giftPreferences ?? {
            likes: "",
            dislikes: "",
            sizes: "",
            allergies: "",
            additionalInfo: "",
          }
        }
      />
    </div>
  )
}
