"use client"

import { LogOut } from "lucide-react"

import { signOut } from "@/lib/auth/auth-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar } from "./ui/avatar"

interface UserAvatarProps extends React.ComponentPropsWithoutRef<"button"> {
  name: string
  email: string
  image: string | null | undefined
}

export const UserAvatar = ({
  name,
  email,
  image,
  className,
  ...props
}: UserAvatarProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn("flex h-10 w-10 rounded-full p-0", className)}
          {...props}
        >
          <Avatar src={image} alt={name} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 space-y-1">
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-muted-foreground text-xs">{email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
