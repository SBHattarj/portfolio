import db from '$lib/db/db.js';
import { insertProjectTypeSchema, projectType, project, type ProjectType } from '$lib/myProjects/schemas/projects.js';
import { zodAction } from 'svelte-zod-form';
import { parsePGError } from "$lib/core/utils/db.js";
import { fail } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

export const actions = {
    createProjectType: zodAction({
        schema: insertProjectTypeSchema,
        async action(_, data) {
            try {
                await db.insert(projectType).values(data).execute()
            } catch (error) {
                const {path, message} = parsePGError(error) ?? {}
                if(path != null && message != null) {
                    return fail(400, {
                        errors: [{
                            path,
                            errors: [message]
                        }]
                    })
                }
                console.log(error)
            }
        }
    }),
    updateProjectType: zodAction({
        schema: insertProjectTypeSchema,
        async action(_, data) {
            try {
                return
                await db.update(projectType).set(data).where(eq(projectType.name, data.name)).execute()
            } catch(error) {
                console.log(error)
            }
        },
        entry: "update-project-type"
    })
}

export async function load({request}) {
    const projectTypes: (ProjectType & {
        projects: number
    })[] = await Promise.all((await db.select().from(projectType)).map(async projectType => {
        return {
            ...projectType,
            ...(
                    await db.select({
                        projects: sql<number>`count(*)`
                    })
                        .from(project)
                        .where(eq(project.type, projectType.name)))[0]
        }
    }))
    return {
        projectTypes
    }
}
