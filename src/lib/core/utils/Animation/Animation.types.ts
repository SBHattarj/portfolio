
export type Frame = {
    duration?: number
    delay?: number
    startCallback?: (node: JQuery, frame: Frame, frameNumber: number) => any,
    endCallback?: (node: JQuery, frame: Frame, frameNumber: number) => any,
    css?: {[key: string]: string | number}
    class?: string
    children?: {
        [key: string]: {
            css?: {[key: string]: string | number},
            class?: string
        }
    }
}