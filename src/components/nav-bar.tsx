import Link from "next/link"

import { cn } from "@/lib/utils"
import { UserAvatar } from "./user-avatar"

interface NavBarProps {
  user:
    | {
        name: string
        email: string
        image?: string | null | undefined
      }
    | undefined
  className?: string
}

export function NavBar({ user, className }: NavBarProps) {
  return (
    <nav className={cn("bg-white border-b", className)}>
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-4">
          <span className="text-2xl font-bold text-red-600">
            🎅 Secret Santa
          </span>
        </Link>

        {user && (
          <UserAvatar name={user.name} email={user.email} image={user.image} />
        )}
      </div>
    </nav>
  )
}
