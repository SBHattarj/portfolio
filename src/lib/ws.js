
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
export default (function handleWs(cb, validator, dispose) {
    return function handleWse(wss) {
        wss.on("connection", ws => {
            if(validator != null && !validator?.(wss, ws)) return
            /** @type {CacheData} */
            const data = {
                cache: {},
                funcMap: new Map(),
                funcRef: new Map(),
                weakRef: new WeakMap()
            }
            ws.onclose = function () {
                if(dispose != null) {
                    dispose(data, wss, ws)
                    return
                }
                delete data.cache
                delete data.funcMap
                delete data.funcRef
                delete data.weakRef
            }
            const wsEvents = WSEvents(ws);
            cb(wsEvents);
        });
    };
});
