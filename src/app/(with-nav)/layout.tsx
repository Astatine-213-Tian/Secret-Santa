import { headers } from "next/headers"

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

  return (
    <>
      <NavBar user={session?.user} />
      {children}
    </>
  )
}
