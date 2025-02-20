"use client";

import { UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth/auth-client";

interface UserAvatarProps extends React.ComponentPropsWithoutRef<"button"> {
  name: string;
  email: string;
  image: string | null | undefined;
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
          {image ? (
            <Image
              src={image}
              alt={name}
              className="h-full w-full rounded-full"
              width={48}
              height={48}
            />
          ) : (
            <UserCircle className="h-full w-full rounded-full" />
          )}
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
  );
};
