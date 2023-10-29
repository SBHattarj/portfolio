import handleWS from "$lib/ws"
import { redirect, type Handle } from "@sveltejs/kit";
import type { WebSocketServer } from "ws"
import type { IncomingMessage } from "http"
import cookie from "cookie"
import { validateVisitor } from "$lib/core/server/visitor";
export const handleWs = handleWS<WebSocketServer>((wsEvents) => {}, (wss, ws: WebSocket, req: IncomingMessage) => {
    const cookies = cookie.parse(req?.headers?.cookie ?? "")
    if(cookies["visitor-id"] == null) return false
    if(cookies["visitor-cookie"] == null) return false
    const visitorId = parseInt(cookies["visitor-id"] ?? "")
    if(isNaN(visitorId)) return false
    const validated = validateVisitor(visitorId, cookies["visitor-cookie"])
    if(!validated) return false;
    console.log("validated user:", cookies["visitor-id"], "with cookie:", cookies["visitor-cookie"])
    return true
});

export const handle: Handle = async ({ event, resolve }) => {
    if(event.request.headers.get("x-forwarded-host") != null || event.url.hostname != "localhost") {
        console.log(event.route.id)
        if(event.route.id?.includes("(private)")) throw redirect(302, "/")
        
    }
    return await resolve(event);
}
