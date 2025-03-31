import { redirect } from "next/navigation"
import { Trash } from "lucide-react"

import { deleteEvent } from "@/server/actions/event"
import {
  getEventAssignments,
  getEventExclusionRules,
  getEventInvitations,
  getEventParticipants,
  OrganizerViewEvent,
} from "@/server/queries/event"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AssignmentsTab from "./_components/assignment-tab"
import ExclusionRulesTab from "./_components/exclusion-rule-tab"
import InvitationsTab from "./_components/invitation-tab"
import ParticipantsTab from "./_components/participant-tab"
import { tabConfig, TabName } from "./_components/tab-config"
import UpdateEventForm from "./_components/update-event-form"

export default async function ManageEventPage(event: OrganizerViewEvent) {
  const { details } = event
  const participants = await getEventParticipants(details.id)
  const invitations = await getEventInvitations(details.id)
  const exclusionRules = await getEventExclusionRules(details.id)
  const assignments = await getEventAssignments(details.id)

  // Handle delete button click
  const handleDelete = async () => {
    "use server"
    await deleteEvent(details.id)
    redirect("/dashboard/events") // Redirects after form submission
  }

  return (
    <div className="space-y-8">
      <UpdateEventForm {...details} />
      {/* Tabs for participants, invitations, assignment rules, and assignments */}
      <Card>
        <Tabs defaultValue={TabName.Participants} className="space-y-4">
          <div className="p-6 pb-0">
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(tabConfig).map(([key, tab]) => (
                <TabsTrigger key={key} value={key}>
                  <tab.icon className="h-4 w-4" />
                  {tab.title}
                </TabsTrigger>
              ))}
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
