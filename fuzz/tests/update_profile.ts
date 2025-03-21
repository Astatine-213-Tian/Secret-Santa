import { updateProfile, UpdateProfileProps } from "@/server/actions/profile"
import { fuzz } from "../fuzz"

export function test() {
  const defaultParams: UpdateProfileProps = {
    name: "John Doe",
    bio: "My updated bio",
    giftPreferences: {
      likes: "food",
      dislikes: "clothing",
      allergies: "peanuts",
      sizes: "M-L",
      additionalInfo: "No additional info",
    },
  }
  fuzz({
    defaultParams: defaultParams,
    func: updateProfile,
    numTests: 1000,
  })
}
