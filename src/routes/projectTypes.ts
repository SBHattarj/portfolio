
export const projectTypeColor = {
    pages: "rgb(255, 2, 48)",
    npm: "#CC3534",
    git: "white"
} as const
export type ProjectTypes = keyof typeof projectTypeColor

export const projectTypes: ProjectTypes[] = Object.keys(projectTypeColor) as any
