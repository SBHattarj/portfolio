import { date, pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod"

export const projectType = pgTable("project_type", {
    name: text("name").primaryKey(),
    color: text("color").notNull()
})

export const project = pgTable("project", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    url: text("url").notNull(),
    creationDate: date("creation_date", { mode: "date" }).notNull(),
    type: text("type").notNull().references(() => projectType.name).default("name")
})

export type ProjectType = typeof projectType.$inferSelect
export type Project = typeof project.$inferSelect

export const insertProjectTypeSchema = createInsertSchema(projectType)
export const insertProjectSchema = createInsertSchema(project)
