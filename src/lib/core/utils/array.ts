
export function range(range: number): Generator<number>
export function range(rangeStart: number, rangeEnd: number): Generator<number>
export function range(rangeStart: number, rangeEnd: number, tick: number): Generator<number>
export function *range(a: number, b?: number, c?: number) {
    const rangeStart = b == null ? 0 : a
    const rangeEnd = b ?? a
    const tick = c ?? 1
    
    for(let n = rangeStart; tick > 0 ? n < rangeEnd : n > rangeEnd; n += tick) {
        yield n
    }
}

export function arrayOfRange(range: number): number[]
export function arrayOfRange(rangeStart: number, rangeEnd: number): number[]
export function arrayOfRange(rangeStart: number, rangeEnd: number, tick: number): number[]
export function arrayOfRange(a: number, b?: number, c?: number) {
    if(b == null) return [...range(a)]
    if(c == null) return [...range(a, b)]
    return [...range(a, b, c)]
}

export type arrayEllement<arrayType extends readonly unknown[]> = 
    arrayType extends readonly (infer ElementType)[] ? ElementType : never