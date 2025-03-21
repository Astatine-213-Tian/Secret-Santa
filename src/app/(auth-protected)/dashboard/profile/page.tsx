import { getProfile } from "@/server/queries/profile"
import { UserProfileForm } from "@/components/user-profile-form"

export default async function ProfilePage() {
  const profile = await getProfile()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-gray-800">Your Profile</h1>
      <UserProfileForm {...profile} />
    </div>
  )
}
