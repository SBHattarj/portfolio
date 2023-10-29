import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const visitor = pgTable('visitor', {
    id: serial("id").primaryKey(),
    cookieHash: text("cookie_hash").unique().notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    invalidateBy: timestamp("invalidate_by", { mode: "date" }).notNull(),
    introComplete: boolean("intro_complete").default(false),
    cookie: text("cookie").notNull(),
    visitorNumber: serial("visitor_number").notNull(),
})

export type Visitor = typeof visitor.$inferSelect
export type VisitorInsert = typeof visitor.$inferInsert
