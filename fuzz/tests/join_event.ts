import { createEvent, EditableEventDetails } from "@/server/actions/event"
import { fuzz } from "../fuzz"

export function test() {
  const defaultParams: EditableEventDetails = {
    name: "My Event",
    budget: 100,
    description: "My event description",
    drawDate: new Date(),
    eventDate: new Date(),
    location: "Toronto, ON",
  }
  fuzz({
    defaultParams: defaultParams,
    func: createEvent,
    numTests: 1000,
  })
}
