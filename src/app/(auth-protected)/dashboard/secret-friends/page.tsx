import { fetchUserAssignments } from "@/server/queries/event"
import { AssignmentCard } from "@/components/assignment-card"

export default async function GiftsPage() {
  const userAssignments = await fetchUserAssignments()

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-semibold text-gray-800">Secret Friends</h1>
      <h2 className="font-medium text-muted-foreground">
        See who you are assigned to be a secret friend for.
      </h2>
      <div className="grid mt-6 grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
        {!userAssignments ? (
          <div>You are not assigned to anybody yet. Try joining an event!</div>
        ) : (
          userAssignments.map((assignment) => (
            <AssignmentCard key={assignment.event.id} {...assignment} />
          ))
        )}
      </div>
    </div>
  )
}
