import WSEvents from "full-client-server-sveltekit/ws-events";
import { serialize, deserialize } from "full-client-server-sveltekit";
/** @typedef {import("full-client-server-sveltekit").CacheData} CacheData */
/** @typedef {import("full-client-server-sveltekit/ws-events").WebSocketServerLike} WebSocketServer */
/** @typedef {import("full-client-server-sveltekit/ws-events").WebSocketLike} WebSocket */


/**
* @template {import("full-client-server-sveltekit/ws-events").WebSocketServerLike} T
* @param {(wse: import("full-client-server-sveltekit/ws-events").WSEventHandler) => any} cb
* @param {(wss: T, ...args: Parameters<Parameters<T["on"]>[1]>) => Promise<boolean> | boolean} [validator]
* @param {(cache: CacheData, wss: WebSocketServer, ...args: Parameters<Parameters<T["on"]>[1]>) => void} [dispose]
* @return {(wse: T) => void}
*/
export default function handleWs(cb, validator, dispose) {
    return function handleWse(wss) {
        wss.on("connection", async (ws, ...args) => {
            if(validator != null && !await validator?.(wss, .../** @type {Parameters<Parameters<T["on"]>[1]>} */([ws, ...args]))) return
            /** @type {CacheData} */
            let data = {
                cache: {},
                functionRef: new Map(),
                functionMap: new Map(),
                weakRef: new WeakMap()
            }
            ws.onclose = function () {
                if(dispose != null) {
                    dispose(data, wss, .../** @type {Parameters<Parameters<T["on"]>[1]>} */([ws, ...args]))
                    return
                }
                delete data.cache
                delete data.functionRef
                delete data.functionMap
                delete data.weakRef
            }
            
            const wsEvents = WSEvents(ws);
            
            wsEvents.on("__internal_full_client_server_import__/lib/core/server/visitor?=,getVisitorNumber=getVisitorNumber,IntroComplete=IntroComplete", /** 
            * @this CacheData
            * @param {string} str
            */ async function (str) {
                if(this.cache == null) return
                if(this.functionMap == null) return
                if(this.functionRef == null) return
                if(this.weakRef == null) return
                let [id, update] = deserialize(
                    str, 
                    "front", 
                    wsEvents,
                    this.cache,
                    this.functionMap,
                    this.functionRef,
                    this.weakRef
                );
                // @ts-ignore
                let caller = async () => await import("/home/mav/repos/portfolio/src/lib/core/server/visitor")

                const result = await caller();
                update();
                wsEvents.emit(`__internal_full_client_server_import__/lib/core/server/visitor?=,getVisitorNumber=getVisitorNumber,IntroComplete=IntroComplete-${id}`, serialize(
                    result, 
                    "back", 
                    wsEvents,
                    this.cache,
                    this.functionRef,
                    this.functionMap,
                    this.weakRef
                ));
            }.bind(data));
        

            wsEvents.on("/home/mav/repos/portfolio/src/routes/+page.svelte-0", /** 
            * @this CacheData
            * @param {string} str
            */ async function (str) {
                if(this.cache == null) return
                if(this.functionMap == null) return
                if(this.functionRef == null) return
                if(this.weakRef == null) return
                let [id, $page, update] = deserialize(
                    str, 
                    "front", 
                    wsEvents,
                    this.cache,
                    this.functionMap,
                    this.functionRef,
                    this.weakRef
                );
                const { getVisitorNumber: getVisitorNumber, IntroComplete: IntroComplete } = await import("/home/mav/repos/portfolio/src/lib/core/server/visitor");
                // @ts-ignore
                let caller = async () => {
// @ts-ignore
                				const id = $page.data.userId;
// @ts-ignore
                				IntroComplete(id);
// @ts-ignore
                				return await getVisitorNumber(id);
// @ts-ignore
                			}

                const result = await caller();
                update($page);
                wsEvents.emit(`/home/mav/repos/portfolio/src/routes/+page.svelte-0-${id}`, serialize(
                    result, 
                    "back", 
                    wsEvents,
                    this.cache,
                    this.functionRef,
                    this.functionMap,
                    this.weakRef
                ));
            }.bind(data));
        

            wsEvents.on("__internal_full_client_server_import__/routes/SideCodePanel.svelte?=SideCodePanel,", /** 
            * @this CacheData
            * @param {string} str
            */ async function (str) {
                if(this.cache == null) return
                if(this.functionMap == null) return
                if(this.functionRef == null) return
                if(this.weakRef == null) return
                let [id, update] = deserialize(
                    str, 
                    "front", 
                    wsEvents,
                    this.cache,
                    this.functionMap,
                    this.functionRef,
                    this.weakRef
                );
                // @ts-ignore
                let caller = async () => await import("/home/mav/repos/portfolio/src/routes/SideCodePanel.svelte")

                const result = await caller();
                update();
                wsEvents.emit(`__internal_full_client_server_import__/routes/SideCodePanel.svelte?=SideCodePanel,-${id}`, serialize(
                    result, 
                    "back", 
                    wsEvents,
                    this.cache,
                    this.functionRef,
                    this.functionMap,
                    this.weakRef
                ));
            }.bind(data));
        
            cb(wsEvents);
    
        })
    }
    
};
