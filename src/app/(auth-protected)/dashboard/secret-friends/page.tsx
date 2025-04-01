import {
  fetchUserGiftGivers,
  fetchUserGiftReceivers,
} from "@/server/queries/event"
import {
  GifterAssignmentCard,
  ReceiverAssignmentCard,
} from "@/components/assignment-card"

export default async function GiftsPage() {
  const receivers = await fetchUserGiftReceivers()
  const gifters = await fetchUserGiftGivers()
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-3xl font-semibold text-gray-800">Secret Friends</h1>
      {!receivers || !gifters ? (
        <div>You have no gift assignments yet. Try joining an event!</div>
      ) : (
        <>
          {/* PEOPLE YOUR ASSIGNED TO */}
          <h2 className="text-2xl font-semibold text-gray-800">
            My Assignments's
          </h2>
          <div className="grid mt-6 grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
            {receivers?.map((r) => (
              <ReceiverAssignmentCard key={r.event.id} {...r} />
            ))}
          </div>
          {/* PEOPLE ASSIGNED TO YOU */}
          <h2 className="text-2xl font-semibold text-gray-800">
            My Gift Givers
          </h2>
          <div className="grid mt-6 grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
            {gifters?.map((a) => (
              <GifterAssignmentCard key={a.event.id} {...a} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
