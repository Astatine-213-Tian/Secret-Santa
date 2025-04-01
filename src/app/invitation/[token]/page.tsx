import Link from "next/link"
import { format } from "date-fns"
import {
  Calendar,
  DollarSign,
  Gift,
  LogIn,
  MapPin,
  UserPlus,
} from "lucide-react"

import { getSession } from "@/lib/auth/auth-server"
import { getInvitationData } from "@/server/queries/invitation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AcceptInvitationButton,
  DeclineInvitationButton,
} from "./client-buttons"

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const { event } = await getInvitationData(token)
  const session = await getSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <main className="h-full container pt-30 px-4 mx-auto flex flex-col items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="relative w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full">
                <Gift className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">You're Invited!</CardTitle>
            <CardDescription>
              {event.organizer.name} has invited you to join a Secret Santa gift
              exchange
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-lg">{event.name}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p>
                      {format(new Date(event.eventDate), "cccc, MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <p>{event.location}</p>
                </div>
                <div className="flex items-start">
                  <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                  <p>Gift Budget: {event.budget}</p>
                </div>
              </div>
              {event.description && (
                <p className="text-sm mt-2 pt-2 border-t border-border">
                  {event.description}
                </p>
              )}
            </div>

            {session && (
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                You are logged in as <strong>{session.user?.email}</strong>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {session ? (
              <AcceptInvitationButton token={token} />
            ) : (
              <>
                <div className="text-center mb-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Please log in or create an account to respond to this
                    invitation
                  </p>
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link href={`/login?callbackUrl=/invitation/${token}`}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/sign-up?callbackUrl=/invitation/${token}`}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </Link>
                </Button>
              </>
            )}
            <div className="relative flex items-center justify-center w-full my-4">
              <div className="absolute w-full border-t border-muted"></div>
              <div className="relative bg-card px-4 text-xs uppercase text-muted-foreground">
                or
              </div>
            </div>
            <DeclineInvitationButton token={token} />
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
