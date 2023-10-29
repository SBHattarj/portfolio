import { certLink, type CertLink } from "server:/lib/core/schemas/certs";
import db from "server:/lib/db/db";
import node from "full-client-server-sveltekit";
export function createCertLink(data?: Partial<CertLink>) {
    return node(async () => {
        if(data == null) return null
        if(data.text == null) return null
        if(data.url == null) return null
        return (
            await db
                .insert(certLink)
                .values(data as CertLink)
                .returning({ id: certLink.id })
        ).at(0)?.id ?? null
    })
}
