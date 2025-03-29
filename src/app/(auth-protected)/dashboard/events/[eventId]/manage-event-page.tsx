"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Clock,
  Edit,
  Gift,
  Plus,
  RefreshCcw,
  RefreshCw,
  Save,
  Shuffle,
  Trash,
  UserMinus,
  UserPlus,
  Users,
  X,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  addExclusionRule,
  createInvitation,
  deleteEvent,
  deleteExclusionRule,
  drawAssignments,
  editAssignment,
  removeParticipant,
  resendInvitation,
  revokeInvitation,
  updateEvent,
} from "@/server/actions/event"
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
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventForm } from "@/components/event-detail-form"
import { eventDetailsSchema } from "@/schemas/event"

enum TabName {
  Participants = "participants",
  Invitations = "invitations",
  Rules = "rules",
  Assignments = "assignments",
}

export default function ManageEventPage(event: OrganizerViewEvent) {
  const { details, participants, invitations, exclusionRules, assignments } =
    event
  // Handle edit event form submission
  const handleFormSubmit = async (data: z.infer<typeof eventDetailsSchema>) => {
    updateEvent(details.id, data) // Update the event details
  }

  // Handle delete button click
  const handleDelete = () => {
    deleteEvent(details.id)
    redirect("/") // Redirects after form submission
  }

  return (
    <div className="space-y-8">
      {/* Event Details Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* The form data only includes the fields that should be edited*/}
          <EventForm
            initialValues={{
              name: details.name,
              location: details.location,
              description: details.description ?? "",
              budget: details.budget,
              eventDate: details.eventDate,
            }}
            submitButtonText="Save Changes"
            handleSubmit={handleFormSubmit}
          />
        </CardContent>
      </Card>

      {/* Tabs for participants, invitations, assignment rules, and assignments */}
      <Card>
        <Tabs defaultValue={TabName.Participants} className="space-y-4">
          <div className="p-6 pb-0">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value={TabName.Participants}>
                <Users className="h-4 w-4" />
                Participants
              </TabsTrigger>
              <TabsTrigger value={TabName.Invitations}>
                <Clock className="h-4 w-4" />
                Invitations
              </TabsTrigger>
              <TabsTrigger value={TabName.Rules}>
                <X className="h-4 w-4" />
                Exclusion Rules
              </TabsTrigger>
              <TabsTrigger value={TabName.Assignments}>
                <Gift className="h-4 w-4" />
                Assignments
              </TabsTrigger>
            </TabsList>
          </div>

          <ParticipantsTab
            eventId={details.id}
            organizerId={details.organizerId}
            participants={participants}
          />
          <InvitationsTab eventId={details.id} invitations={invitations} />
          <ExclusionRulesTab
            eventId={details.id}
            exclusionRules={exclusionRules}
            participants={participants}
          />
          <AssignmentsTab
            assignments={assignments}
            eventId={details.id}
            drawingComplete={details.drawCompleted}
            participants={participants}
          />
        </Tabs>
      </Card>

      {/* Delete Event Button */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="w-4 h-4" />
                Delete Event
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this event?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will delete the event and
                  all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className={buttonVariants({
                    variant: "destructive",
                  })}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}

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

interface InvitationsTabProps {
  eventId: string
  invitations: OrganizerViewEvent["invitations"]
}

const InvitationsTab = ({
  eventId,
  invitations: initialInvitations,
}: InvitationsTabProps) => {
  const [invitations, setInvitations] = useState(initialInvitations)

  const handleRevokeInvitation = async (email: string) => {
    await revokeInvitation(eventId, email)
    setInvitations(invitations.filter((i) => i.email !== email))
  }

  const formSchema = z.object({
    email: z.string().email(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  const onInvite = async (data: z.infer<typeof formSchema>) => {
    const res = await createInvitation(eventId, data.email)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success("Invitation sent")
      form.reset()
      setInvitations([...invitations, { email: data.email, status: "pending" }])
    }
  }

  return (
    <TabsContent value={TabName.Invitations}>
      <CardHeader className="pt-0">
        <CardTitle className="text-2xl font-bold">Invitations</CardTitle>
        <CardDescription>
          Manage pending and expired invitations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onInvite)}>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter email address"
              {...form.register("email")}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <UserPlus className="h-4 w-4" />
              {form.formState.isSubmitting ? "Inviting..." : "Invite"}
            </Button>
          </div>
          {form.formState.errors.email && (
            <p className="text-[0.8rem] font-medium mt-1 text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </form>

        {invitations.length > 0 && (
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.email}>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invitation.status === "expired"
                          ? "destructive"
                          : "warning"
                      }
                      className="capitalize"
                    >
                      {invitation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {invitation.status === "expired" && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          await resendInvitation(eventId, invitation.email)
                          toast.success("Invitation resent")
                        }}
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </Button>
                    )}
                    {invitation.status === "pending" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to revoke this invitation?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove the invitation from the event.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className={buttonVariants({
                                variant: "destructive",
                              })}
                              onClick={() =>
                                handleRevokeInvitation(invitation.email)
                              }
                            >
                              Revoke
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
        )}
      </CardContent>
    </TabsContent>
  )
}

interface ExclusionRulesTabProps {
  eventId: string
  exclusionRules: OrganizerViewEvent["exclusionRules"]
  participants: OrganizerViewEvent["participants"]
}

const ExclusionRulesTab = ({
  eventId,
  exclusionRules: initialExclusionRules,
  participants,
}: ExclusionRulesTabProps) => {
  const [exclusionRules, setExclusionRules] = useState(initialExclusionRules)

  const [selectedGiver, setSelectedGiver] = useState<string>()
  const [selectedForbiddenReceiver, setSelectedForbiddenReceiver] =
    useState<string>()

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddRule = async () => {
    if (selectedGiver && selectedForbiddenReceiver) {
      const res = await addExclusionRule(
        eventId,
        selectedGiver,
        selectedForbiddenReceiver
      )
      if (res?.error) {
        toast.error(res.error)
      } else {
        setExclusionRules([
          ...exclusionRules,
          {
            giver: participants.find((p) => p.id === selectedGiver)!,
            forbiddenReceiver: participants.find(
              (p) => p.id === selectedForbiddenReceiver
            )!,
          },
        ])
        setSelectedGiver(undefined)
        setSelectedForbiddenReceiver(undefined)
        setIsDialogOpen(false)
      }
    }
  }

  const handleDeleteRule = async (
    giverId: string,
    forbiddenReceiverId: string
  ) => {
    await deleteExclusionRule(eventId, giverId, forbiddenReceiverId)
    setExclusionRules(
      exclusionRules.filter(
        (r) =>
          r.giver.id !== giverId &&
          r.forbiddenReceiver.id !== forbiddenReceiverId
      )
    )
  }

  return (
    <TabsContent value={TabName.Rules}>
      <CardHeader className="pt-0">
        <CardTitle className="text-2xl font-bold">Exclusion Rules</CardTitle>
        <CardDescription>
          Manage the rules that prevent participants from being assigned to each
          other.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" />
              Add New Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Exclusion Rule</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Select a participant and who they cannot be assigned to give a
              gift to.
            </DialogDescription>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant">Participant</Label>
                <Select value={selectedGiver} onValueChange={setSelectedGiver}>
                  <SelectTrigger className="w-full">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="cannot-give-to">Cannot Give To</Label>
                <Select
                  value={selectedForbiddenReceiver}
                  onValueChange={setSelectedForbiddenReceiver}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select participant" />
                  </SelectTrigger>
                  <SelectContent>
                    {participants
                      .filter((p) => p.id !== selectedGiver)
                      .map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={!selectedGiver || !selectedForbiddenReceiver}
                onClick={handleAddRule}
                loadingText="Adding rule..."
              >
                Add Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {exclusionRules.length > 0 && (
          <Table className="mt-5">
            <TableHeader>
              <TableRow>
                <TableHead>Participant</TableHead>
                <TableHead>Cannot Give To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exclusionRules.map((rule) => (
                <TableRow key={rule.giver.id}>
                  <TableCell>{rule.giver.name}</TableCell>
                  <TableCell>{rule.forbiddenReceiver.name}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash className="w-4 h-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this rule?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove the rule from the event.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className={buttonVariants({
                              variant: "destructive",
                            })}
                            onClick={() =>
                              handleDeleteRule(
                                rule.giver.id,
                                rule.forbiddenReceiver.id
                              )
                            }
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </TabsContent>
  )
}

interface AssignmentsTabProps {
  assignments: OrganizerViewEvent["assignments"]
  eventId: string
  drawingComplete: boolean
  participants: OrganizerViewEvent["participants"]
}

const AssignmentsTab = ({
  assignments: initialAssignments,
  eventId,
  drawingComplete,
  participants,
}: AssignmentsTabProps) => {
  const [assignments, setAssignments] = useState(initialAssignments)
  const [tempAssignments, setTempAssignments] = useState(initialAssignments)
  const [isEditing, setIsEditing] = useState(false)

  const handleDrawAssignments = async () => {
    const res = await drawAssignments(eventId)
    if ("error" in res) {
      toast.error(res.error)
    } else {
      setAssignments(res)
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
      setAssignments(tempAssignments)
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
