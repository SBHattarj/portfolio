import {get, writable} from 'svelte/store';
import { sleep } from '$lib/core/utils/async';

export const infoStore = writable<{text: string, class?: "normal" | "info"} | undefined>()
export const InfoStayTime = writable<number>(3000)
export const InfoSlidDuration = writable<number>(300)

export async function say(text: string, stayTime= 3000) {
    InfoStayTime.set(stayTime)
    await sleep(10)
    infoStore.set({text, class: "normal"})
    await sleep(stayTime + 2 * get(InfoSlidDuration))
}

export async function info(text: string, stayTime = 3000) {
    InfoStayTime.set(stayTime)
    await sleep(10)
    infoStore.set({text, class: "info"})
    await sleep(stayTime + 2 * get(InfoSlidDuration))
}