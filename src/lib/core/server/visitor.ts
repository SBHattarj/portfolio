import db from "server:/lib/db/db";
import node from "full-client-server-sveltekit";
import { randomBytes, createHmac } from "node:crypto"
import { visitor } from "server:/lib/core/schemas/visitor";
import { eq } from "server:npm:drizzle-orm";

export function createVisitor() {
    return node(async () => {
        const cookieHash = randomBytes(64).toString('hex')
        const cookie = randomBytes(64).toString('hex')
        const current = new Date()
        const invalidateBy = new Date(current.getFullYear(), current.getMonth() + 2, current.getDate())
        const id = (await db.insert(visitor).values({
            cookieHash,
            invalidateBy,
            cookie
        }).returning({
            id: visitor.id
        })).at(0)?.id
        return {
            id,
            cookieHash,
            cookie,
            introComplete: false
        }
    })
}

export function revalidateVisitor(id: number, cookie: string) {
    return node(async () => {
        const user = (await db.select({
            cookieHash: visitor.cookieHash,
            invalidateBy: visitor.invalidateBy,
            cookie: visitor.cookie,
            introComplete: visitor.introComplete
        }).from(visitor).where(eq(visitor.id, isNaN(id) ? -1 : id)).limit(1))[0]
        const now = new Date()
        if(user?.invalidateBy < new Date()) {
            const newCookie = randomBytes(64).toString('hex')
            const newCookieHash = createHmac('sha256', newCookie).update(newCookie).digest("base64")
            await db.update(visitor).set({
                cookieHash: newCookieHash,
                cookie: newCookie,
                invalidateBy: new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())
            }).where(eq(visitor.id, id)).execute()
            return {
                id: id,
                cookieHash: newCookieHash,
                cookie: newCookie,
                introComplete: user.introComplete
            }
        }
        if(user == null) return
        if(createHmac('sha256', user.cookieHash).update(user.cookie).digest("base64") !== cookie) return
        await db.update(visitor).set({
            invalidateBy: new Date(now.getFullYear(), now.getMonth() + 2, now.getDate())
        }).where(eq(visitor.id, id)).execute()
        return {
            ...user,
            id: id
        }
    })
}

export function validateVisitor(id: number, cookie: string) {
    return node(async () => {
        const user = (await db.select({
            cookieHash: visitor.cookieHash,
            invalidateBy: visitor.invalidateBy,
            cookie: visitor.cookie,
        }).from(visitor).where(eq(visitor.id, isNaN(id) ? -1 : id)).limit(1))[0]
        if(user?.invalidateBy < new Date()) {
            return false
        }
        return user != null
            && user.invalidateBy > new Date()
            && createHmac('sha256', user.cookieHash).update(user.cookie).digest("base64") === cookie
    })
}

export function getVisitorNumber(id: number) {
    return node(async () => {
        const { visitorNumber } = (await db.select({
            visitorNumber: visitor.visitorNumber
            }).from(visitor).where(eq(visitor.id, id)).limit(1)
      )[0] ?? {}
      if(visitorNumber == null) return 0;
      return visitorNumber;
    })
}

export function IntroComplete(id: number) {
    return node(async () => {
        await db.update(visitor).set({
            introComplete: true
        }).where(eq(visitor.id, id)).execute()
    })
}
