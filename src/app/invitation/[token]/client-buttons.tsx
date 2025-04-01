"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  acceptInvitation,
  declineInvitation,
} from "@/server/actions/invitation"
import { Button } from "@/components/ui/button"

interface ButtonProps {
  token: string
}

export const AcceptInvitationButton = ({ token }: ButtonProps) => {
  const router = useRouter()
  const handleAccept = async () => {
    const res = await acceptInvitation(token)
    if (res.data) {
      router.push(`/dashboard/events/${res.data.eventId}`)
    } else {
      toast.error(res.error)
    }
  }

  return (
    <Button className="w-full" size="lg" onClick={handleAccept}>
      Accept Invitation
    </Button>
  )
}

export const DeclineInvitationButton = ({ token }: ButtonProps) => {
  const handleDecline = async () => {
    await declineInvitation(token)
    toast.success("Invitation declined")
  }

  return (
    <Button variant="outline" className="w-full" onClick={handleDecline}>
      Decline
    </Button>
  )
}
