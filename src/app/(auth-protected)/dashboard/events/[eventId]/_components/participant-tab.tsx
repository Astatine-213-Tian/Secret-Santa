"use client"

import { useRouter } from "next/navigation"
import { UserMinus } from "lucide-react"
import { toast } from "sonner"

import { removeParticipant } from "@/server/actions/participant"
import { OrganizerViewEvent } from "@/server/queries/event"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { TabName } from "./tab-config"

interface ParticipantsTabProps {
  eventId: string
  organizerId: string
  participants: OrganizerViewEvent["participants"]
}

const ParticipantsTab = ({
  eventId,
  organizerId,
  participants,
}: ParticipantsTabProps) => {
  const router = useRouter()

  const handleRemoveParticipant = async (
    participantId: string,
    autoDraw: boolean
  ) => {
    const res = await removeParticipant(eventId, participantId, autoDraw)
    if (res?.error) {
      toast.error(res.error)
    } else {
      router.refresh()
    }
  }

  return (
    <TabsContent value={TabName.Participants}>
      <CardHeader className="pt-0">
        <CardTitle className="text-2xl font-bold">Participants</CardTitle>
        <CardDescription>
          Invite or remove participants from your event.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell className="font-medium">
                  {participant.name}
                </TableCell>
                <TableCell>{participant.email}</TableCell>
                <TableCell className="text-right">
                  {participant.id !== organizerId && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <UserMinus className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to remove {participant.name}?
                          </AlertDialogTitle>
                          <div className="text-sm space-y-2 text-muted-foreground">
                            <p>
                              This participant may already have assignments in
                              the Secret Santa draw. Please choose one of the
                              following actions:
                            </p>
                            <ul className="list-disc pl-5">
                              <li>
                                <strong>Remove and Redraw:</strong> Remove this
                                participant and <strong>reassign</strong> their
                                Secret Santa assignments to{" "}
                                <strong>other participants</strong>.
                              </li>
                              <li>
                                <strong>Remove and Clear:</strong> Remove this
                                participant and <strong>clear</strong> the
                                Secret Santa assignments for{" "}
                                <strong>all</strong> other participants.
                              </li>
                            </ul>
                          </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleRemoveParticipant(participant.id, false)
                            }
                            className={buttonVariants({
                              variant: "destructive",
                            })}
                          >
                            Remove and Clear
                          </AlertDialogAction>
                          <AlertDialogAction
                            onClick={() =>
                              handleRemoveParticipant(participant.id, true)
                            }
                            className={buttonVariants({
                              variant: "destructive",
                            })}
                          >
                            Remove and Redraw
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </TabsContent>
  )
}

export default ParticipantsTab
