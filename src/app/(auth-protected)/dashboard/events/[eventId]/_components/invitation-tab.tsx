"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { RefreshCcw, Table, Trash, UserPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import {
  createInvitation,
  resendInvitation,
  revokeInvitation,
} from "@/server/actions/invitation"
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
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import { TabName } from "./tab-config"

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

export default InvitationsTab
