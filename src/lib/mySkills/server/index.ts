import node from "full-client-server-sveltekit";
import db from "server:/lib/db"
import { or, eq } from "server:npm:drizzle-orm";
import { skill, type Skill } from "server:/lib/mySkills/schemas/skills";
import { certLink } from "server:/lib/core/schemas/certs";
import type { CertLink } from "../components/MySkillCard.svelte";

export function getSkills() {
    return node(async () => {
        return Array.from((await db
            .select()
            .from(skill)
            .leftJoin(certLink, or(eq(certLink.id, skill.linkedInAssesment), eq(certLink.id, skill.certificate)))
           ).reduce((accumulator, current) => {
               console.log("getting", current)
               let currentSkill = accumulator.get(current.skill.name) ?? {
                    name: current.skill.name,
                    logo: current.skill.logo
                }
               if(!accumulator.has(current.skill.name)) {
                   accumulator.set(current.skill.name, currentSkill!)
               }
               if(current.skill.linkedInAssesment === current.cert_link?.id) {
                   currentSkill.linkedInAssesment = current.cert_link
               }
               if(current.skill.certificate === current.cert_link?.id) {
                   currentSkill.certificate = current.cert_link
               }
               return accumulator
           }, new Map<string, {name: string, linkedInAssesment?: CertLink, certificate?: CertLink, logo: string}>())
           .values())
    })
}
