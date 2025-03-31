"use client"

import { useState } from "react"
import { UserMinus } from "lucide-react"

import { removeParticipant } from "@/server/actions/participant"
import { OrganizerViewEvent } from "@/server/queries/event"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
  participants: initialParticipants,
}: ParticipantsTabProps) => {
  const [participants, setParticipants] = useState(initialParticipants)

  const handleRemoveParticipant = async (participantId: string) => {
    await removeParticipant(eventId, participantId)
    setParticipants(participants.filter((p) => p.id !== participantId))
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
                          <AlertDialogDescription>
                            This will also remove any assignments and rules
                            associated with this participant.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleRemoveParticipant(participant.id)
                            }
                            className={buttonVariants({
                              variant: "destructive",
                            })}
                          >
                            Remove
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
