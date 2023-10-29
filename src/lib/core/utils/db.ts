import { dev } from "$app/environment"

const keyRegex = /\(([A-Za-z0-9]+)\)=(.*)/

const parsePGErrorMap = {
    "23505": {
        field(detail: string) {
            const [_, potentialField] = detail.match(keyRegex) ?? []
            return potentialField
        },
        message: "Already exists"
    },
    "23503": {
        field(detail: string) {
            const [_, potentialField] = detail.match(keyRegex) ?? []
            return potentialField
        },
        message: `key not found${dev ? " maybe pass null rather than undefined" : ""}`
    }
} satisfies Record<string, {field: (detail: string) => string | void, message: string}>
const pgErrorCodes = Object.keys(parsePGErrorMap) as (keyof typeof parsePGErrorMap)[]
type PGErrorProtocol = {
    code: (typeof pgErrorCodes)[number]
    detail: string
    table: string
}

export function ensurePGError(error: unknown): error is PGErrorProtocol {
    return typeof error === "object"
        && error != null
        && "code" in error
        && "detail" in error
        && "table" in error
        && typeof error.detail === "string"
        && typeof error.table === "string"
        && pgErrorCodes.includes(error.code as any)
}

export function parsePGError(
    error: unknown,
    fieldKeyMap?: Record<string,
    Record<string, string[]>>
) {
    if(!ensurePGError(error)) return
    const {field: fieldFn, message} = parsePGErrorMap[error.code] ?? {}
    if(fieldFn == null || fieldFn == null) return
    const field = fieldFn(error.detail)
    if(field == null) return
    const path = fieldKeyMap?.[error.table]?.[field] ?? [field]
    return {path, message}
}
