import { zodAction } from 'svelte-zod-form';
import { skill, skillCreateSchema, skillUpdateSchema } from '$lib/mySkills/schemas/skills';
import db from "$lib/db"
import { createCertLink } from '$lib/core/server/index.js';
import { parsePGError } from '$lib/core/utils/db.js';
import { fail } from '@sveltejs/kit';
import { getSkills } from "$lib/mySkills/server/index.js";
import { certLink } from "$lib/core/schemas/certs"
import { eq } from 'drizzle-orm';

export const actions = {
    createSkill: zodAction({
        schema: skillCreateSchema,
        async action(_, data) {
            try {
                const [certificate, linkedInAssesment] = await Promise.all(
                    [
                        createCertLink(data.certificate),
                        createCertLink({url: data.linkedInAssesment, text: `linkedin: ${data.name}`})
                    ]
                )
                await db.insert(skill).values({
                    name: data.name,
                    linkedInAssesment: linkedInAssesment,
                    certificate: certificate,
                    logo: await data.logo.text()

                }).execute()
            }
            catch(error) {
                console.log(error)
                const {path, message} = parsePGError(error) ?? {}
                if(path == null) return
                if(message == null) return
                return fail(
                    400, 
                    {
                        errors: [{
                            path, 
                            errors: [message]
                        }]
                    }
                )
            }

        }
    }),
    updateSkill: zodAction({
        schema: skillUpdateSchema,
        validate({data, revalidate}) {
            if(data.logo?.name === "") {
                delete data.logo
                revalidate()
            }
            return true
        },
        async action(_, {
            name,
            linkedInAssesmentId,
            certificateId,
            linkedInAssesment,
            certificate,
            ...data
        }) {
            try {
                if(linkedInAssesmentId != null && linkedInAssesment != null) {
                    db.update(certLink).set({
                        url: linkedInAssesment
                    }).execute()
                }
                else if (linkedInAssesment != null) {
                    linkedInAssesmentId = await createCertLink({url: linkedInAssesment, text: `linkedin: ${name}`}) as number
                }
                if(certificateId != null && certificate?.url != null && certificate?.text != null) {
                    db.update(certLink).set({
                        ...certificate
                    }).execute()
                }
                else if (certificate?.url != null && certificate?.text != null) {
                    certificateId = await createCertLink(certificate) as number
                }
                console.log(certificateId, linkedInAssesmentId)
                await db.update(skill).set({
                    logo: await data.logo?.text(),
                    certificate: certificateId ?? null,
                    linkedInAssesment: linkedInAssesmentId ?? null,
                }).where(eq(skill.name, name)).execute()
            }
            catch (error) {
                console.log(error)
            }
        },
        entry: "update-skill"
    })
}

export async function load() {
    const skills = await getSkills();
    return {
        skills
    }
}
