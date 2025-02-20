import { pgTable, text, timestamp, boolean, primaryKey, index, jsonb } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

const createId = () => nanoid(11);

export const user = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  profile: jsonb().$type<UserProfile>(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey().$defaultFn(createId),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey().$defaultFn(createId),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
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
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey().$defaultFn(createId),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});


export const event = pgTable("event", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  eventDate: timestamp("event_date").notNull(),
  drawDate: timestamp("draw_date").notNull(),
  location: text("location"),
  joinCode: text("join_code").notNull(),
});

export const participant = pgTable("participant", {
  eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  isAdmin: boolean("is_admin").notNull(),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
}, (table) => [
  primaryKey({columns: [table.eventId, table.userId]})
]);

export const santaPair = pgTable("santa_pair", {
  eventId: text("event_id").notNull().references(() => event.id, { onDelete: "cascade" }),
  giverId: text("giver_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  receiverId: text("receiver_id").notNull().references(() => user.id, { onDelete: "cascade" }),
}, (table) => [
  primaryKey({columns: [table.eventId, table.giverId, table.receiverId]}),
  index("giver_id_idx").on(table.giverId),
]);