
import type { WebSocketServer } from "ws";
import WSEvents, { type WSEventHandler } from "ws-events";
import { serialize, deserialize } from "full-client-server-sveltekit";
export default (function handleWs(cb: (wse: WSEventHandler) => any): (wse: WebSocketServer) => void {
    return function handleWse(wss) {
        wss.on("connection", ws => {
            const data = {
                cache: {}
            }
            ws.onclose = function () {
                delete (data as any).cache
            }
            const wsEvents = WSEvents(ws);
            cb(wsEvents);
        });
    };
});
                