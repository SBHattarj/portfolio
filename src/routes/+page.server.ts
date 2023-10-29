import { createVisitor } from "$lib/core/server/visitor";
import { getProjects } from "$lib/myProjects/server";
import { getSkills } from "$lib/mySkills/server";
import type { PageServerLoad } from "./$types";
import { createHmac } from "node:crypto"

export const load: PageServerLoad = async function load(event) {
    return {
        projects: [...await getProjects()],
        skills: [...await getSkills()]
    }
}
