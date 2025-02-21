import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Gift } from "lucide-react"

import { auth } from "@/lib/auth/auth-server"
import { UserAvatar } from "@/components/user-avatar"

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Gift className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold">Secret Santa</span>
            </div>

            <UserAvatar
              name={session.user.name}
              email={session.user.email}
              image={session.user.image}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
