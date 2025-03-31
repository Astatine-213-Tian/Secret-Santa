"server-only"

import { getProfile } from "@/server/queries/profile"
import { UserInfoCard } from "@/components/user-profile-card"

// TODO: need to figure out how to SECURELY pass in the accessMode
/**
 * For a user to view some other user's profile
 */
// export default async function UserProfilesPage({
//   params,
// }: {
//   params: Promise<{ userId: string }>
// }) {
//   const { userId } = await params
//   const profile = await getProfile("my_event_participant", userId)

//   return <UserInfoCard {...profile} />
// }
