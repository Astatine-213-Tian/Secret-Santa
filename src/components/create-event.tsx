import Link from "next/link"
import { CirclePlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./ui/button"

export const CreateEvent = () => {
  return (
    <Link
      href="/event/create"
      className={cn(buttonVariants({ variant: "outline" }))}
    >
      <CirclePlus className="w-4 h-4" />
      Create New Event
    </Link>
  )
}
