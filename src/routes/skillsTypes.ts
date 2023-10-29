import type { CertLink } from "$lib/mySkills/components/MySkillCard.svelte";
export type SkillType = {
    name: string,
    linkedInAssesment?: CertLink,
    certificate?: CertLink
}
