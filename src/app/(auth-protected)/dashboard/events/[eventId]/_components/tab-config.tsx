import { Clock, Gift, ShieldMinus, User } from "lucide-react"

export enum TabName {
  Participants = "participants",
  Invitations = "invitations",
  Rules = "rules",
  Assignments = "assignments",
}

export const tabConfig = {
  [TabName.Participants]: {
    title: "Participants",
    icon: User,
  },
  [TabName.Invitations]: {
    title: "Invitations",
    icon: Clock,
  },
  [TabName.Rules]: {
    title: "Rules",
    icon: ShieldMinus,
  },
  [TabName.Assignments]: {
    title: "Assignments",
    icon: Gift,
  },
}
