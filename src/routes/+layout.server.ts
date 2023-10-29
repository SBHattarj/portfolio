import { createHmac } from "node:crypto"
import { createVisitor, revalidateVisitor } from "$lib/core/server/visitor"
export async function load({cookies}) {
    const visitorId = cookies.get("visitor-id")
    const cookie = cookies.get("visitor-cookie")
    const visitorIdTrue = parseInt(visitorId ?? "")
    if(cookie == null || isNaN(visitorIdTrue)) {
        const {id, cookieHash, cookie} = await createVisitor()
        if(id == null) return
        cookies.set("visitor-id", id?.toString())
        cookies.set("visitor-cookie", createHmac('sha256', cookieHash).update(cookie).digest("base64"))
        return {
            userId: id
        }
    }
    const user = await revalidateVisitor(visitorIdTrue, cookie)
    console.log("layout load", user)
    if(user == null) return
    cookies.set("visitor-id", user?.id?.toString())
    cookies.set("visitor-cookie", createHmac('sha256', user.cookieHash).update(user.cookie).digest("base64"))
    return {
        userId: user?.id,
        introComplete: user?.introComplete
    }
}
