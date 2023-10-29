import db from '$lib/db/db.js';
import { insertProjectSchema, project } from '$lib/myProjects/schemas/projects.js';
import { zodAction } from 'svelte-zod-form';
import { eq } from "drizzle-orm"
import { fail } from '@sveltejs/kit';

export const actions = {
    createProject: zodAction({
        schema: insertProjectSchema,
        async action(_, data) {
            try {
                await db.insert(project).values(data).execute();
            }
            catch (error) {
                console.error(error);
            }
        }
    }),
    updateProject: zodAction({
        schema: insertProjectSchema,
        entry: "updateProject",
        async action(_, {id, description, url, creationDate}) {
            if(id == null) return fail(500, {
                errors: [{
                    path: ["id"],
                    errors: ["Required"]
                }]
            })
            try {
                await db.update(project).set({description, url, creationDate}).where(eq(project.id, id)).execute();
            } catch {
            }
        }
    })
}

export async function load({ params }) {
    const projects = await db.select().from(project).where(eq(project.type, params.type));
    return {
        projects
    }
}
