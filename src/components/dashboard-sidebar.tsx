"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, Gift, User } from "lucide-react"

const SIDEBAR_LINKS = [
  {
    href: "/dashboard/events",
    label: "Events",
    icon: Gift,
  },
  {
    href: "/dashboard/calendar",
    label: "Calendar",
    icon: Calendar,
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <aside className="bg-white w-64 hidden sm:block shadow-xl">
      <nav className="flex flex-col h-full px-2 py-4 space-y-2">
        {SIDEBAR_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center px-4 py-2 rounded-md ${
              isActive(link.href)
                ? "bg-red-100 text-red-600"
                : "text-gray-700 hover:bg-red-100"
            }`}
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
