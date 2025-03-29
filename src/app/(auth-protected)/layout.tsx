import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth/auth-server"
import { NavBar } from "@/components/nav-bar"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NavBar user={session?.user} className="h-16" />
      <div className="flex-1 overflow-y-auto flex flex-col">{children}</div>
    </div>
  )
}
