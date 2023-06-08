export function sleep(ms: number) {
    if(ms === 0) return Promise.resolve()
    return new Promise<void>((resolve, reject) => setTimeout(resolve, ms))
}

interface ForEachCallback<T, This> {(this: This, cur: T, index: number, array: T[]): any}
interface MapCallback<T, V, This> {(this: This, cur: T, index: number, array: T[]): V}

export function asyncReduce<T, V = number>(arr: T[], cb: (accumulator: V, current: T, index: number, arr: T[]) => Promise<V>, innitial: V) {
    return arr.reduce(async (accumulatorRaw, current, index, array) => {
        const accumulator = await accumulatorRaw
        return await cb(accumulator as V, current, index, array)
    }, Promise.resolve(innitial ?? 0) as Promise<V>)
}

export function asyncMap<T, V = T,This = null>(arr: T[], cb: MapCallback<T, V, This>, thisArg?: This): Promise<V[]> {
    return asyncReduce(
        arr,
        async (
            accumulator,
            current,
            index,
            arr
            ) => [...accumulator, await (cb.bind(thisArg as This) as any)(current, index, arr)],
            [] as V[]
        )
}


export async function asyncForEach<T, This = null>(arr: Array<T>, callback: ForEachCallback<T, This>, thisArg?: This): Promise<void> {
    for(const [index, item] of arr.entries()) {
        await (callback.bind(thisArg as This) as any)(item, index, arr)
    }
}

export async function asyncFindEntry<T, This = null>(arr: T[], callback: MapCallback<T, boolean, any>, thisArg?: This): Promise<[number, T] | undefined> {
    for(const [index, item] of arr.entries()) {
        const result = await (callback.bind(thisArg as This) as any)(item, index, arr)
        if(result) return [index, item]
    }
}

export async function asyncFind<T, This = null>(arr: T[], callback: MapCallback<T, boolean, any>, thisArg?: This) {
    return (await asyncFindEntry(arr, callback, thisArg))?.[1]
}
export async function asyncFindIndex<T, This = null>(arr: T[], callback: MapCallback<T, boolean, any>, thisArg?: This) {
    return (await asyncFindEntry(arr, callback, thisArg))?.[0]
}
