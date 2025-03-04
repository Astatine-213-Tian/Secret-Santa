"use client"

import { ClipboardCopy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  text: string
  className?: string
}

export const CopyButton = ({ text, className }: CopyButtonProps) => {
  const onCopy = () => {
    navigator.clipboard.writeText(text)
    toast.success("Text copied to clipboard")
  }
  return (
    <Button variant="ghost" size="sm" onClick={onCopy} className={className}>
      <ClipboardCopy className="h-4 w-4" />
      Copy
    </Button>
  )
}
