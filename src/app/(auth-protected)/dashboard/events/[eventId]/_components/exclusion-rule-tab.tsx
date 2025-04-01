"use client"

import { useState } from "react"
import { Plus, Trash } from "lucide-react"
import { toast } from "sonner"

import {
  addExclusionRule,
  deleteExclusionRule,
} from "@/server/actions/assignment"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { TabsContent } from "@/components/ui/tabs"
import { TabName } from "./tab-config"

interface ExclusionRulesTabProps {
  eventId: string
  exclusionRules: OrganizerViewEvent["exclusionRules"]
  participants: OrganizerViewEvent["participants"]
}

const ExclusionRulesTab = ({
  eventId,
  exclusionRules,
  participants,
}: ExclusionRulesTabProps) => {
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

export default ExclusionRulesTab
