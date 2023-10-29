export default class EventEmitter extends EventTarget {
    listeners: Map<string, EventListenerOrEventListenerObject[]>
    fnToListners: Map<(data: any) => void, EventListenerOrEventListenerObject>
    constructor(...args: ConstructorParameters<typeof EventTarget>) {
        super(...args);
        this.listeners = new Map()
        this.fnToListners = new Map()

    }
    addEventListener(event: string, fn: EventListenerOrEventListenerObject) {
        super.removeEventListener(event, fn)
        if(!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event)!.push(fn)
    }
    on(event: string, fn: (data: unknown) => void) {
        this.fnToListners.set(fn, function (data) {
            if("detail" in data) {
                fn.call(this, data.detail)
            }
            fn.call(this, null)
        })
        this.addEventListener(event, this.fnToListners.get(fn)!)
    }
    off(event: string, fn?: (data: unknown) => void) {
        if(fn == null) {
            this.listeners.get(event)?.forEach(fn => {
                const fnk = [...this.fnToListners].find(([_, f]) => f === fn)?.[0]
                if(fnk != null) this.fnToListners.delete(fnk)
                this.removeEventListener(event, fn)
            })
            this.listeners.delete(event)
            return
        }
        let fnl = this.fnToListners.get(fn)
        if(fnl != null) this.removeEventListener(event, fnl)
    }
    emit(event: string, data: any) {
        this.dispatchEvent(new CustomEvent(event, {
            detail: data
        }))
    }
}
