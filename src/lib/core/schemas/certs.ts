import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const certLink = pgTable("cert_link", {
    id: serial("id").primaryKey(),
    text: text("text").notNull(),
    url: text("url").notNull(),
})

export type CertLink = typeof certLink.$inferSelect
