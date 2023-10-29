import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { certLink } from "./../../core/schemas/certs";
import { z } from "zod";
import type { CertLink } from "$lib/core/schemas/certs";

export const skill = pgTable("skill", {
    name: text("name").primaryKey(),
    linkedInAssesment: integer("linked_in_assesment").references(() => certLink.id),
    certificate: integer("certificate").references(() => certLink.id),
    logo: text("logo").notNull()
})

export type Skill = typeof skill.$inferSelect & {
    certificate?: CertLink,
    linkedInAssesment?: CertLink
}

export const skillCreateSchema = z.object({
    logo: z.instanceof(File).refine(file => file.type.startsWith("image/") && file.type.includes("svg"), "must be a svg"),
    name: z.string(),
    linkedInAssesment: z.string().url().optional(),
    certificate: z.object({
        text: z.string(),
        url: z.string().url()
    }).optional()
})

export const skillUpdateSchema = z.object({
    logo: z.instanceof(File).refine(
        file => file.type.startsWith("image/") && file.type.includes("svg"),
        "must be a svg"
    ).optional(),
    name: z.string(),
    linkedInAssesment: z.string().url().optional(),
    certificate: z.object({
        text: z.string(),
        url: z.string().url()
    }).optional(),
    certificateId: z.number().optional(),
    linkedInAssesmentId: z.number().optional()
})
