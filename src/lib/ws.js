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
            
            wsEvents.on("/home/mav/repos/portfolio/src/routes/+page.svelte-0", /** 
            * @this CacheData
            * @param {string} str
            */ async function (str) {
                if(this.cache == null) return
                if(this.functionMap == null) return
                if(this.functionRef == null) return
                if(this.weakRef == null) return
                let [id, $page, $$invalidate, visitorNumber, getVisitorNumber, IntroComplete, update] = deserialize(
                    str, 
                    "front", 
                    wsEvents,
                    this.cache,
                    this.functionMap,
                    this.functionRef,
                    this.weakRef
                );
                // @ts-ignore
                let caller = async () => {
// @ts-ignore
                				const id = $page.data.userId;
// @ts-ignore
                				$$invalidate(2, visitorNumber = await getVisitorNumber(id));
// @ts-ignore
                				IntroComplete(id);
// @ts-ignore
                				console.log(visitorNumber);
// @ts-ignore
                			}

                const result = await caller();
                update($page, $$invalidate, visitorNumber, getVisitorNumber, IntroComplete);
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
        

            wsEvents.on("__internal_full_client_server_import__/lib/db/db?=db,", /** 
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
                let caller = async () => await import("/home/mav/repos/portfolio/src/lib/db/db")

                const result = await caller();
                update();
                wsEvents.emit(`__internal_full_client_server_import__/lib/db/db?=db,-${id}`, serialize(
                    result, 
                    "back", 
                    wsEvents,
                    this.cache,
                    this.functionRef,
                    this.functionMap,
                    this.weakRef
                ));
            }.bind(data));
        

            wsEvents.on("__internal_full_client_server_import__node:crypto?=,randomBytes=randomBytes,createHmac=createHmac", /** 
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
                let caller = async () => await import("node:crypto")

                const result = await caller();
                update();
                wsEvents.emit(`__internal_full_client_server_import__node:crypto?=,randomBytes=randomBytes,createHmac=createHmac-${id}`, serialize(
                    result, 
                    "back", 
                    wsEvents,
                    this.cache,
                    this.functionRef,
                    this.functionMap,
                    this.weakRef
                ));
            }.bind(data));
        

            wsEvents.on("__internal_full_client_server_import__/lib/core/schemas/visitor?=,visitor=visitor", /** 
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
                let caller = async () => await import("/home/mav/repos/portfolio/src/lib/core/schemas/visitor")

                const result = await caller();
                update();
                wsEvents.emit(`__internal_full_client_server_import__/lib/core/schemas/visitor?=,visitor=visitor-${id}`, serialize(
                    result, 
                    "back", 
                    wsEvents,
                    this.cache,
                    this.functionRef,
                    this.functionMap,
                    this.weakRef
                ));
            }.bind(data));
        

            wsEvents.on("__internal_full_client_server_import__drizzle-orm?=,eq=eq", /** 
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
                let caller = async () => await import("drizzle-orm")

                const result = await caller();
                update();
                wsEvents.emit(`__internal_full_client_server_import__drizzle-orm?=,eq=eq-${id}`, serialize(
                    result, 
                    "back", 
                    wsEvents,
                    this.cache,
                    this.functionRef,
                    this.functionMap,
                    this.weakRef
                ));
            }.bind(data));
        

            wsEvents.on("/home/mav/repos/portfolio/src/lib/core/server/visitor.ts-0", /** 
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
                const { default: db } = await import("/home/mav/repos/portfolio/src/lib/db/db");
                const { randomBytes: randomBytes } = await import("node:crypto");
                const { visitor: visitor } = await import("/home/mav/repos/portfolio/src/lib/core/schemas/visitor");
                // @ts-ignore
                let caller = async () => {
// @ts-ignore
                    const cookieHash = randomBytes(64).toString("hex");
// @ts-ignore
                    const cookie = randomBytes(64).toString("hex");
// @ts-ignore
                    const current = /* @__PURE__ */ new Date();
// @ts-ignore
                    const invalidateBy = new Date(current.getFullYear(), current.getMonth() + 2, current.getDate());
// @ts-ignore
                    const id = (await db.insert(visitor).values({
// @ts-ignore
                      cookieHash,
// @ts-ignore
                      invalidateBy,
// @ts-ignore
                      cookie
// @ts-ignore
                    }).returning({
// @ts-ignore
                      id: visitor.id
// @ts-ignore
                    })).at(0)?.id;
// @ts-ignore
                    return {
// @ts-ignore
                      id,
// @ts-ignore
                      cookieHash,
// @ts-ignore
                      cookie,
// @ts-ignore
                      introComplete: false
// @ts-ignore
                    };
// @ts-ignore
                  }

                const result = await caller();
                update();
                wsEvents.emit(`/home/mav/repos/portfolio/src/lib/core/server/visitor.ts-0-${id}`, serialize(
                    result, 
                    "back", 
                    wsEvents,
                    this.cache,
                    this.functionRef,
                    this.functionMap,
                    this.weakRef
                ));
            }.bind(data));
        

            wsEvents.on("/home/mav/repos/portfolio/src/lib/core/server/visitor.ts-1", /** 
            * @this CacheData
            * @param {string} str
            */ async function (str) {
                if(this.cache == null) return
                if(this.functionMap == null) return
                if(this.functionRef == null) return
                if(this.weakRef == null) return
                let [id1, cookie, id, update] = deserialize(
                    str, 
                    "front", 
                    wsEvents,
                    this.cache,
                    this.functionMap,
                    this.functionRef,
                    this.weakRef
                );
                const { default: db } = await import("/home/mav/repos/portfolio/src/lib/db/db");
                const { randomBytes: randomBytes, createHmac: createHmac } = await import("node:crypto");
                const { visitor: visitor } = await import("/home/mav/repos/portfolio/src/lib/core/schemas/visitor");
                const { eq: eq } = await import("drizzle-orm");
                // @ts-ignore
                let caller = async () => {
// @ts-ignore
                    const user = (await db.select({
// @ts-ignore
                      cookieHash: visitor.cookieHash,
// @ts-ignore
                      invalidateBy: visitor.invalidateBy,
// @ts-ignore
                      cookie: visitor.cookie,
// @ts-ignore
                      introComplete: visitor.introComplete
// @ts-ignore
                    }).from(visitor).where(eq(visitor.id, isNaN(id) ? -1 : id)).limit(1))[0];
// @ts-ignore
                    const now = /* @__PURE__ */ new Date();
// @ts-ignore
                    if (user?.invalidateBy < /* @__PURE__ */ new Date()) {
// @ts-ignore
                      const newCookie = randomBytes(64).toString("hex");
// @ts-ignore
                      const newCookieHash = createHmac("sha256", newCookie).update(newCookie).digest("base64");
// @ts-ignore
                      await db.update(visitor).set({
// @ts-ignore
                        cookieHash: newCookieHash,
// @ts-ignore
                        cookie: newCookie,
// @ts-ignore
                        invalidateBy: new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())
// @ts-ignore
                      }).where(eq(visitor.id, id)).execute();
// @ts-ignore
                      return {
// @ts-ignore
                        id,
// @ts-ignore
                        cookieHash: newCookieHash,
// @ts-ignore
                        cookie: newCookie,
// @ts-ignore
                        introComplete: user.introComplete
// @ts-ignore
                      };
// @ts-ignore
                    }
// @ts-ignore
                    if (user == null)
// @ts-ignore
                      return;
// @ts-ignore
                    if (createHmac("sha256", user.cookieHash).update(user.cookie).digest("base64") !== cookie)
// @ts-ignore
                      return;
// @ts-ignore
                    console.log(user);
// @ts-ignore
                    await db.update(visitor).set({
// @ts-ignore
                      invalidateBy: new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())
// @ts-ignore
                    }).where(eq(visitor.id, id)).execute();
// @ts-ignore
                    return {
// @ts-ignore
                      ...user,
// @ts-ignore
                      id
// @ts-ignore
                    };
// @ts-ignore
                  }

                const result = await caller();
                update(cookie, id);
                wsEvents.emit(`/home/mav/repos/portfolio/src/lib/core/server/visitor.ts-1-${id1}`, serialize(
                    result, 
                    "back", 
                    wsEvents,
                    this.cache,
                    this.functionRef,
                    this.functionMap,
                    this.weakRef
                ));
            }.bind(data));
        

            wsEvents.on("/home/mav/repos/portfolio/src/lib/core/server/visitor.ts-2", /** 
            * @this CacheData
            * @param {string} str
            */ async function (str) {
                if(this.cache == null) return
                if(this.functionMap == null) return
                if(this.functionRef == null) return
                if(this.weakRef == null) return
                let [id1, cookie, id, update] = deserialize(
                    str, 
                    "front", 
                    wsEvents,
                    this.cache,
                    this.functionMap,
                    this.functionRef,
                    this.weakRef
                );
                const { default: db } = await import("/home/mav/repos/portfolio/src/lib/db/db");
                const { createHmac: createHmac } = await import("node:crypto");
                const { visitor: visitor } = await import("/home/mav/repos/portfolio/src/lib/core/schemas/visitor");
                const { eq: eq } = await import("drizzle-orm");
                // @ts-ignore
                let caller = async () => {
// @ts-ignore
                    const user = (await db.select({
// @ts-ignore
                      cookieHash: visitor.cookieHash,
// @ts-ignore
                      invalidateBy: visitor.invalidateBy,
// @ts-ignore
                      cookie: visitor.cookie
// @ts-ignore
                    }).from(visitor).where(eq(visitor.id, isNaN(id) ? -1 : id)).limit(1))[0];
// @ts-ignore
                    if (user?.invalidateBy < /* @__PURE__ */ new Date()) {
// @ts-ignore
                      return false;
// @ts-ignore
                    }
// @ts-ignore
                    return user != null && user.invalidateBy > /* @__PURE__ */ new Date() && createHmac("sha256", user.cookieHash).update(user.cookie).digest("base64") === cookie;
// @ts-ignore
                  }

                const result = await caller();
                update(cookie, id);
                wsEvents.emit(`/home/mav/repos/portfolio/src/lib/core/server/visitor.ts-2-${id1}`, serialize(
                    result, 
                    "back", 
                    wsEvents,
                    this.cache,
                    this.functionRef,
                    this.functionMap,
                    this.weakRef
                ));
            }.bind(data));
        

            wsEvents.on("/home/mav/repos/portfolio/src/lib/core/server/visitor.ts-3", /** 
            * @this CacheData
            * @param {string} str
            */ async function (str) {
                if(this.cache == null) return
                if(this.functionMap == null) return
                if(this.functionRef == null) return
                if(this.weakRef == null) return
                let [id1, id, update] = deserialize(
                    str, 
                    "front", 
                    wsEvents,
                    this.cache,
                    this.functionMap,
                    this.functionRef,
                    this.weakRef
                );
                const { default: db } = await import("/home/mav/repos/portfolio/src/lib/db/db");
                const { visitor: visitor } = await import("/home/mav/repos/portfolio/src/lib/core/schemas/visitor");
                const { eq: eq } = await import("drizzle-orm");
                // @ts-ignore
                let caller = async () => {
// @ts-ignore
                    const { visitorNumber } = (await db.select({
// @ts-ignore
                      visitorNumber: visitor.visitorNumber
// @ts-ignore
                    }).from(visitor).where(eq(visitor.id, id)).limit(1))[0] ?? {};
// @ts-ignore
                    if (visitorNumber == null)
// @ts-ignore
                      return 0;
// @ts-ignore
                    return visitorNumber;
// @ts-ignore
                  }

                const result = await caller();
                update(id);
                wsEvents.emit(`/home/mav/repos/portfolio/src/lib/core/server/visitor.ts-3-${id1}`, serialize(
                    result, 
                    "back", 
                    wsEvents,
                    this.cache,
                    this.functionRef,
                    this.functionMap,
                    this.weakRef
                ));
            }.bind(data));
        

            wsEvents.on("/home/mav/repos/portfolio/src/lib/core/server/visitor.ts-4", /** 
            * @this CacheData
            * @param {string} str
            */ async function (str) {
                if(this.cache == null) return
                if(this.functionMap == null) return
                if(this.functionRef == null) return
                if(this.weakRef == null) return
                let [id1, id, update] = deserialize(
                    str, 
                    "front", 
                    wsEvents,
                    this.cache,
                    this.functionMap,
                    this.functionRef,
                    this.weakRef
                );
                const { default: db } = await import("/home/mav/repos/portfolio/src/lib/db/db");
                const { visitor: visitor } = await import("/home/mav/repos/portfolio/src/lib/core/schemas/visitor");
                const { eq: eq } = await import("drizzle-orm");
                // @ts-ignore
                let caller = async () => {
// @ts-ignore
                    await db.update(visitor).set({
// @ts-ignore
                      introComplete: true
// @ts-ignore
                    }).where(eq(visitor.id, id)).execute();
// @ts-ignore
                  }

                const result = await caller();
                update(id);
                wsEvents.emit(`/home/mav/repos/portfolio/src/lib/core/server/visitor.ts-4-${id1}`, serialize(
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
