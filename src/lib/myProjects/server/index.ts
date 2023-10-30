import node from "full-client-server-sveltekit";
import { projectType, project, type Project } from "server:/lib/myProjects/schemas/projects";
import db from "server:/lib/db";
import { eq, and, gt, lt } from "server:npm:drizzle-orm";
export function getProjects(limit: number = 10, offset: number = 0) {
    return node(async () => {
        return (await db
            .select()
            .from(projectType)
            .innerJoin(
                project, 
	        eq(
		    project.type,
		    projectType.name
		),
            )).reduce((accumulator, current) => {
                if(accumulator.has(current.project_type.name)) {
                    accumulator.get(current.project_type.name)?.projects.push(current.project)
                    return accumulator
                }
                accumulator.set(current.project_type.name, {
                    color: current.project_type.color,
                    projects: [current.project]
                })
                return accumulator
            }, new Map<string, {color: string, projects: Project[]}>())
    })
}
