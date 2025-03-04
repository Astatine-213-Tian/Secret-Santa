import { InferSelectModel, relations } from "drizzle-orm"
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"
import { customAlphabet, nanoid } from "nanoid"

import type { GiftPreferences } from "@/lib/types"

const createId = () => nanoid(11)
const createCode = () =>
  customAlphabet("123456789ABCDEFGHIJKLMNPQRSTUVWXYZ", 9)()

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
  drawDate: timestamp("draw_date").notNull(),
  location: text("location").notNull(),
  budget: integer("budget").notNull(),
  organizerId: varchar("organizer_id", { length: 11 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  joinCode: varchar("join_code", { length: 9 })
    .notNull()
    .$defaultFn(createCode)
    .unique(),
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
    secretFriendId: varchar("secret_friend_id", { length: 11 }).references(
      () => user.id,
      {
        onDelete: "cascade",
      }
    ),
  },
  (table) => [primaryKey({ columns: [table.eventId, table.userId] })]
)

export const eventRelations = relations(event, ({ many }) => ({
  participants: many(eventParticipant),
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
    secretFriend: one(user, {
      fields: [eventParticipant.secretFriendId],
      references: [user.id],
    }),
  })
)
