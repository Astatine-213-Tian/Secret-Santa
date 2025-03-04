import Image from "next/image"

import { cn } from "@/lib/utils"

interface AvatarProps {
  src: string | null | undefined
  alt: string
  size?: number
}

export const Avatar = ({ src, alt, size = 48 }: AvatarProps) => {
  return (
    <div className="relative">
      {src ? (
        <Image
          src={src}
          alt={alt}
          className="rounded-full aspect-square"
          width={size}
          height={size}
        />
      ) : (
        <AvatarFallback name={alt} size={size} />
      )}
    </div>
  )
}

const stringToColor = (str: string) => {
  const colors = [
    "bg-blue-400",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-gray-400",
    "bg-teal-400",
    "bg-lime-400",
    "bg-indigo-400",
    "bg-fuchsia-400",
    "bg-cyan-400",
  ]
  const asciiSum = str
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const color = colors[asciiSum % colors.length]
  return color
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .join("")
    .slice(0, 2)
}

const AvatarFallback = ({ name, size }: { name: string; size: number }) => {
  const initials = getInitials(name)
  const bgColor = stringToColor(name)
  return (
    <div
      className={cn("flex items-center justify-center rounded-full", bgColor)}
      style={{
        fontSize: size * 0.4,
        width: size,
        height: size,
      }}
    >
      <span className="text-white font-semibold">{initials}</span>
    </div>
  )
}
