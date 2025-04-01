import { InferSelectModel, relations, sql } from "drizzle-orm"
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core"
import { nanoid } from "nanoid"

import type { GiftPreferences, GiftSubmitFormData } from "@/lib/types"

const createId = () => nanoid(11)
const createToken = () => nanoid(20)

export const user = pgTable("user", {
  id: varchar("id", { length: 11 }).primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  normalizedEmail: text("normalized_email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  bio: text("bio"),
  giftPreferences: jsonb().$type<GiftPreferences>(),
})

export const session = pgTable("session", {
  id: varchar("id", { length: 11 }).primaryKey().$defaultFn(createId),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 11 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})

export const account = pgTable("account", {
  id: varchar("id", { length: 11 }).primaryKey().$defaultFn(createId),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 11 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

export const verification = pgTable("verification", {
  id: varchar("id", { length: 11 }).primaryKey().$defaultFn(createId),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const event = pgTable("event", {
  id: varchar("id", { length: 11 }).primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  eventDate: timestamp("event_date").notNull(),
  drawCompleted: boolean("draw_completed").notNull().default(false),
  location: text("location").notNull(),
  budget: integer("budget").notNull(),
  organizerId: varchar("organizer_id", { length: 11 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})
export type EventSchema = InferSelectModel<typeof event>

export const eventParticipant = pgTable(
  "event_participant",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 11 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.eventId, table.userId] })]
)

export const assignment = pgTable(
  "assignment",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    giverId: varchar("giver_id", { length: 11 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    receiverId: varchar("receiver_id", { length: 11 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.eventId, table.giverId] }),
    unique("assignment_receiver_unique").on(table.eventId, table.receiverId),
  ]
)

// ADDED: gift-submit details (one-2-one w' assignment)
export const giftSubmit = pgTable(
  "gift_submit",
  {
    id: varchar("id", { length: 11 }).primaryKey().$defaultFn(createId),
    assignmentEventId: text("assignment_event_id")
      .notNull()
      .references(() => assignment.eventId, { onDelete: "cascade" }),
    assignmentGiverId: varchar("assignment_giver_id", { length: 11 })
      .notNull()
      .references(() => assignment.giverId, { onDelete: "cascade" }),
    submittedAt: timestamp("submitted_at").notNull().defaultNow(),
    giftDetails: jsonb("gift_details").notNull().$type<GiftSubmitFormData>(),
  },
  (table) => [
    primaryKey({ columns: [table.assignmentEventId, table.assignmentGiverId] }),
  ]
)

// exclusion rules: user1 can't be assigned to user2
export const assignmentExclusion = pgTable(
  "assignment_exclusion",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    giverId: varchar("giver_id", { length: 11 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    forbiddenReceiverId: varchar("forbidden_receiver_id", { length: 11 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.eventId, table.giverId, table.forbiddenReceiverId],
    }),
  ]
)

export const invitationStatus = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "rejected",
])

export const invitation = pgTable(
  "invitation",
  {
    token: text("token").notNull().primaryKey().$defaultFn(createToken),
    eventId: text("event_id")
      .notNull()
      .references(() => event.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    normalizedEmail: text("normalized_email").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    status: invitationStatus("status").notNull().default("pending"),
    revoked: boolean("revoked").notNull().default(false),
    expiresAt: timestamp("expires_at")
      .notNull()
      .default(sql`now() + interval '24 hours'`),
  },
  (table) => [
    uniqueIndex("invitation_event_id_normalized_email_unique")
      .on(table.eventId, table.normalizedEmail)
      .where(sql`${table.revoked} = false`),
  ]
)

export const userRelations = relations(user, ({ many }) => ({
  eventParticipants: many(eventParticipant),
}))

export const eventRelations = relations(event, ({ many, one }) => ({
  assignments: many(assignment),
  participants: many(eventParticipant),
  organizer: one(user, {
    fields: [event.organizerId],
    references: [user.id],
  }),
}))

export const invitationRelations = relations(invitation, ({ one }) => ({
  event: one(event, {
    fields: [invitation.eventId],
    references: [event.id],
  }),
}))

export const eventParticipantRelations = relations(
  eventParticipant,
  ({ one }) => ({
    event: one(event, {
      fields: [eventParticipant.eventId],
      references: [event.id],
    }),
    participant: one(user, {
      fields: [eventParticipant.userId],
      references: [user.id],
    }),
  })
)

export const assignmentRelations = relations(assignment, ({ one }) => ({
  event: one(event, {
    fields: [assignment.eventId],
    references: [event.id],
  }),
  giver: one(user, {
    fields: [assignment.giverId],
    references: [user.id],
  }),
  receiver: one(user, {
    fields: [assignment.receiverId],
    references: [user.id],
  }),
}))

export const assignmentExclusionRelations = relations(
  assignmentExclusion,
  ({ one }) => ({
    event: one(event, {
      fields: [assignmentExclusion.eventId],
      references: [event.id],
    }),
    giver: one(user, {
      fields: [assignmentExclusion.giverId],
      references: [user.id],
    }),
    forbiddenReceiver: one(user, {
      fields: [assignmentExclusion.forbiddenReceiverId],
      references: [user.id],
    }),
  })
)

// ADDED:
export const giftSubmitRelations = relations(giftSubmit, ({ one }) => ({
  assignment: one(assignment, {
    fields: [giftSubmit.assignmentEventId, giftSubmit.assignmentGiverId],
    references: [assignment.eventId, assignment.giverId],
  }),
}))
