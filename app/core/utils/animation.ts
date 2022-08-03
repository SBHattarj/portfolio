import $ from "jquery"
import formData from "../symbols/formData"
import { sleep } from "./async"

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

export default class Animation {
    private element?: JQuery
    private frames: Frame[] = []
    private CurrentFrame = 0
    private playing = false
    private onPlayCallbacks: ((self: this) => any)[] = []
    private onFrameStartCallbacks: ((self: this) => any)[] = []
    private onFrameEndCallbacks: ((self: this) => any)[] = []
    private onFinnishCallbacks: ((self: this) => any)[] = []
    private onPauseCallbacks: ((self: this) => any)[] = []
    private onBindCallbacks: ((self: this) => any)[] = []

    get isPlaying() {
        return this.playing && this.element != null
    }

    get currentFrame() {
        return {
            ...this.defaultFrame,
            ...this.frames[this.CurrentFrame],
            children: {
                ...this.defaultFrame.children,
                ...Object.entries(this.frames[this.CurrentFrame]?.children ?? {})
                    .reduce((children, [child, childFrame]) => ({
                        ...children,
                        [child]: {
                            ...this.defaultFrame.children?.[child],
                            childFrame
                        }
                    }), {} as Frame['children']),
            }
        }
    }
    get previouseFrame() {
        return {
            ...this.defaultFrame,
            ...this.frames[this.CurrentFrame-1],
            children: {
                ...this.defaultFrame.children,
                ...Object.entries(this.frames[this.CurrentFrame-1]?.children ?? {})
                    .reduce((children, [child, childFrame]) => ({
                        ...children,
                        [child]: {
                            ...this.defaultFrame.children?.[child],
                            childFrame
                        }
                    }), {} as Frame['children'])
            }
        }
    }
    set currentFrame(frame: Frame) {
        this.frames[this.CurrentFrame] = frame
    }

    constructor(private defaultFrame: Frame = {}, node?: HTMLElement | JQuery | string) {
        if(node == null) return

        this.element = $(node as HTMLElement | JQuery)
    }

    frame(frameData: Frame & {number?: number}) {
        const {number, ...frame} = frameData

        if(number == null || number < 0) {
            this.frames.push(frame)
            return this
        }

        this.frames.splice(number, 0, frame)
        return this
    }
    changeFrame(frameData: Frame & {number: number}) {
        const {number, ...frame} = frameData

        if(number < 0) return this
        if(number > (this.frames.length - 1)) return this

        this.frames[number] = frame
        return this
    }
    deleteFrame(frame: number, deleteCount = 1) {
        if(frame < 0) return this
        this.frames.splice(frame, deleteCount)
        return this
    }

    setCurrentFrame(frame: number) {
        this.CurrentFrame = frame
        return this
    }

    onPlay(callback: (self: this) => any) {
        this.onPlayCallbacks.push(callback)
        return this
    }
    onFrameStart(callback: (self: this) => any) {
        this.onFrameStartCallbacks.push(callback)
        return this
    }
    onFrameEnd(callback: (self: this) => any) {
        this.onFrameEndCallbacks.push(callback)
        return this
    }
    onFinnish(callback: (self: this) => any) {
        this.onFinnishCallbacks.push(callback)
        return this
    }

    async *[Symbol.asyncIterator](): AsyncGenerator<Frame & {previouseFrame: Frame}> {
        for(const [index] of this.frames.entries()) {
            this.playing = true
            this.CurrentFrame = index
            await sleep(this.currentFrame.delay ?? 0)
            this.onFrameStartCallbacks.forEach(callback => callback(this))
            yield {
                ...this.currentFrame,
                previouseFrame: this.previouseFrame
            }
            this.onFrameEndCallbacks.forEach(callback => callback(this))
            await sleep(this.currentFrame.duration ?? 0)
        }
        yield {
            ...this.defaultFrame,
            previouseFrame: this.currentFrame
        }
        this.CurrentFrame = 0
        this.playing = false
    }

    async playFrame(stopAfter=true) {
        if(!this.element) throw new Error("Must bind to an element before playing a frame")
        this.playing = true
        const currentFrame = this.currentFrame
        
        await sleep(currentFrame.delay ?? 0)
        currentFrame.startCallback?.(this.element, this.currentFrame, this.CurrentFrame)
        this.onFrameStartCallbacks.forEach(callback => callback(this))
        
        this.element.css(currentFrame.css ?? {})
        if(this.previouseFrame.class) this.element.removeClass(this.previouseFrame.class)
        if(currentFrame.class) this.element.addClass(currentFrame.class)
        
        Object.entries(currentFrame.children ?? {}).forEach(([child, childFrame]) => {
            this.element?.find(child).css(childFrame.css ?? {})
            if(childFrame.class) this.element?.find(child).addClass(childFrame.class)
        })
        Object.entries(this.previouseFrame?.children ?? {}).forEach(([child, childFrame]) => {
            if(childFrame.class) this.element?.find(child).removeClass(childFrame.class)
        })

        await sleep(currentFrame.duration ?? 0)
        
        currentFrame.endCallback?.(this.element, this.currentFrame, this.CurrentFrame)
        this.onFinnishCallbacks.forEach(callback => callback(this))
        this.playing = !stopAfter
        return this
    }

    async play() {
        this.playing = true

        this.onPlayCallbacks.forEach(callback => callback(this))

        if(this.element == null) return this

        for(const [index] of this.frames.slice(this.CurrentFrame).entries()) {
            this.CurrentFrame = index
            
            if(!this.playing) return this
            
            await this.playFrame(false)
        }
        this.CurrentFrame = 0
        this.playing = false

        this.onFinnishCallbacks.forEach(callback => callback(this))
        return this
    }

    onPause(callback: (self: this) => any) {
        this.onPauseCallbacks.push(callback)
        return this
    }
    async pause() {
        this.playing = false
        this.onPauseCallbacks.forEach(callback => callback(this))
        return this
    }


    onBind(callback: (self: this) => any) {
        this.onBindCallbacks.push(callback)
        return this
    }
    async bind(node: HTMLElement | JQuery | string) {
        this.element = $(node as HTMLElement | JQuery)
        if(this.playing) return await this.play()
        return this
    }

    subscribe(callback: (self: this) => any) {
        callback(this)
        this
            .onPlay(callback)
            .onFinnish(callback)
            .onPause(callback)
            .onFrameStart(callback)
            .onFrameEnd(callback)
            .onBind(callback)

        const unsubscribe = this.unsubscribe.bind(this, callback)
        return {
            unsubscribe
        }
    }
    unsubscribe(callback: (self: this) => any) {
        this.onPlayCallbacks.splice(this.onPlayCallbacks.indexOf(callback), 1)
        this.onFinnishCallbacks.splice(this.onFinnishCallbacks.indexOf(callback), 1)
        this.onPauseCallbacks.splice(this.onPauseCallbacks.indexOf(callback), 1)
        this.onFrameStartCallbacks.splice(this.onPauseCallbacks.indexOf(callback), 1)
        this.onFrameEndCallbacks.splice(this.onPauseCallbacks.indexOf(callback), 1)
        this.onBindCallbacks.splice(this.onBindCallbacks.indexOf(callback), 1)
    }

    svelte(node: HTMLElement) {
        this.bind(node)
    }
}
