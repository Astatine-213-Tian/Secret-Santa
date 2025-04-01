"use client"

import { useEffect, useState } from "react"
import { Edit, RefreshCw, Save, Shuffle } from "lucide-react"
import { toast } from "sonner"

import { drawAssignments, editAssignment } from "@/server/actions/assignment"
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
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

interface AssignmentsTabProps {
  assignments: OrganizerViewEvent["assignments"]
  eventId: string
  drawingComplete: boolean
  participants: OrganizerViewEvent["participants"]
}

const AssignmentsTab = ({
  assignments,
  eventId,
  drawingComplete,
  participants,
}: AssignmentsTabProps) => {
  const [tempAssignments, setTempAssignments] = useState(assignments)
  const [isEditing, setIsEditing] = useState(false)

  const handleDrawAssignments = async () => {
    const res = await drawAssignments(eventId)
    if (res?.error) {
      toast.error(res.error)
    }
  }

  const handleSaveAssignments = async () => {
    const tempAssignmentsIds = tempAssignments
      .filter((a) => a.receiver !== null)
      .map((a) => ({
        giverId: a.giver.id,
        receiverId: a.receiver!.id,
      }))
    if (tempAssignmentsIds.length !== participants.length) {
      toast.error("All participants must have an assignment")
      return
    }
    const res = await editAssignment(eventId, tempAssignmentsIds)
    if (res?.error) {
      toast.error(res.error)
    } else {
      setIsEditing(false)
    }
  }

  useEffect(() => {
    setTempAssignments(assignments)
  }, [assignments])

  return (
    <TabsContent value={TabName.Assignments}>
      <CardHeader className="pt-0 flex-row justify-between items-start">
        <div>
          <CardTitle className="text-2xl font-bold">
            Secret Santa Assignments
          </CardTitle>
          <CardDescription>
            View and manage who is giving gifts to whom.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveAssignments}>
                <Save className="h-4 w-4" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4" />
                Edit Assignments
              </Button>
              {drawingComplete ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      <RefreshCw className="h-4 w-4" />
                      Redraw
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Redraw Assignments</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to redraw all assignments? This
                        will erase the current assignments and create new ones.
                        Participants may have already seen their current
                        assignments.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDrawAssignments}>
                        Redraw
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button onClick={handleDrawAssignments}>
                  <Shuffle className="h-4 w-4" />
                  Draw Names
                </Button>
              )}
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Gives Gift To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEditing
              ? tempAssignments.map((assignment) => (
                  <TableRow key={assignment.giver.id}>
                    <TableCell className="font-medium">
                      {assignment.giver.name}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={assignment.receiver?.id ?? ""}
                        onValueChange={(value) =>
                          setTempAssignments(
                            tempAssignments.map((a) =>
                              a.giver.id === assignment.giver.id
                                ? {
                                    ...a,
                                    receiver:
                                      participants.find(
                                        (p) => p.id === value
                                      ) ?? null,
                                  }
                                : a
                            )
                          )
                        }
                      >
                        <SelectTrigger className="w-72">
                          <SelectValue placeholder="Select participant" />
                        </SelectTrigger>
                        <SelectContent>
                          {participants.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              : assignments.map((assignment) => (
                  <TableRow key={assignment.giver.id}>
                    <TableCell className="font-medium">
                      {assignment.giver.name}
                    </TableCell>

                    <TableCell>
                      {assignment.receiver?.name ?? "Pending"}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </TabsContent>
  )
}

export default AssignmentsTab
