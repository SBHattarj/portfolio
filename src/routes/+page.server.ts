import { createVisitor, getVisitorNumber } from "$lib/core/server/visitor";
import { getProjects } from "$lib/myProjects/server";
import { getSkills } from "$lib/mySkills/server";
import type { PageServerLoad } from "./$types";
import { createHmac } from "node:crypto"

export const load: PageServerLoad = async function load(event) {
    const {userId, introComplete} = (await event.parent())
    return {
        projects: [...await getProjects()],
        skills: [...await getSkills()],
        visitorNumber: userId == null || !introComplete ? null : await getVisitorNumber(userId)
    }
}
