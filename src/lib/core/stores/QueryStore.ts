import type { Page } from "@sveltejs/kit";
import type { Readable } from "svelte/motion";
import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import type { Writable } from "svelte/store";

export class QueryStore extends Map<string, string> implements Readable<QueryStore> {
    url?: URL;
    _eventHandler: EventTarget;
    unsubscriber: () => void;
    page: Readable<Page>
    static globalInstance?: QueryStore
    constructor(pageStore: Readable<Page>) {
        if(QueryStore.globalInstance != null) {
            super(QueryStore.globalInstance)
            this.url = QueryStore.globalInstance.url;
            this._eventHandler = QueryStore.globalInstance.eventHandler;
            this.page = pageStore
            QueryStore.globalInstance.page = pageStore
            this.unsubscriber = this.subscribe((that) => {
                this.eventHandler = that.eventHandler
                this.page = that.page
                if(this !== that) {
                    for(let [key, value] of that) {
                        if(!this.has(key) || this.get(key) === value) {
                            this.set(key, value);
                        }
                    }
                    outer: for(let [key] of this) {
                        for(let k of that.keys()) {
                            if(k === key) {
                                continue outer
                            }
                        }
                        this.delete(key);
                    }
                }
            })
            return
        }
        super();
        this.page = pageStore
        this._eventHandler = new EventTarget()
        this.unsubscriber = () => {}
    }
    get eventHandler() {
        if(this._eventHandler == null) this._eventHandler = new EventTarget()
        return this._eventHandler
    }
    set eventHandler(eh) {
        this._eventHandler = eh
    }
    set(key: string, value: string) {
        this.url?.searchParams.set(key, value);
        if(browser && this.url != null) goto(this.url, { keepFocus: true, replaceState: true, noScroll: true})
        super.set(key, value);
        this.eventHandler.dispatchEvent(new CustomEvent("change", {
            detail: this
        }))
        return this;
    }
    get(key: string): string | undefined {
        if(this.has(key) && !this.url?.searchParams.has(key)) {
            super.delete(key)
            this.eventHandler.dispatchEvent(new CustomEvent("change", {
                detail: this
            }))
        }
        if(super.get(key) !== this.url?.searchParams.get(key)) {
            if(this.url?.searchParams.get(key) == null) {
                super.delete(key)
            }
            else this.set(key, this.url?.searchParams.get(key)!)
        }
        return this.url?.searchParams.get(key) ?? super.get(key);
    }
    getAsStore<T extends string>(key: T): Writable<string | null | undefined> & {
        name: T
    } {
        const that = this;
        return {
            set(value) {
                if(value == null || value === "") {
                    return that.delete(key)
                }
                that.set(key, value)
            },
            subscribe(fn) {
                return that.subscribe((value) => {
                    fn(value.get(key))
                })
            },
            update(updater) {
                const value = updater(that.get(key))
                if(value == null || value === "") {
                    return that.delete(key)
                }
                that.set(key, value)
            },
            name: key
        }
    }
    subscribe(fn: (value: this) => void) {
        const pageUnsubscriber = this.page?.subscribe(page => {
            this.url = page.url
            this.eventHandler.dispatchEvent(new CustomEvent("change", {
                detail: this
            }))
        })
        fn(this)
        function handler(e: CustomEvent<QueryStore>) {
            fn(e.detail as any);
        }
        this.eventHandler.addEventListener("change", handler as any);
        return () => {
            this.eventHandler.removeEventListener("change", handler as any);
            this.unsubscriber()
            if(pageUnsubscriber != null) pageUnsubscriber()
        }
    }
    delete(key: string): boolean {
        this.url?.searchParams.delete(key);
        if(browser && this.url != null) goto(this.url, {replaceState: true, noScroll: true, keepFocus: true})
        const result = super.delete(key);
        this.eventHandler.dispatchEvent(new CustomEvent("change", {
            detail: this
        }))
        return result
    }
}

export function getQueryStore(pageStore: Readable<Page>) {
    if(QueryStore.globalInstance == null) {
        QueryStore.globalInstance = new QueryStore(pageStore)
    }
    QueryStore.globalInstance.page = pageStore
    return QueryStore.globalInstance
}

export function getQueryStoreKey<T extends string>(pageStore: Readable<Page>, key: T) {
    return getQueryStore(pageStore).getAsStore(key)

}
