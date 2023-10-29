<script lang="ts">
	import { page } from "$app/stores";
	import { getQueryStoreKey } from "$lib/core/stores/QueryStore";
    import { MainStyles } from "$lib/core/stores/styles";
    import { svgExtend } from "$lib/core/utils/svg"
	import Form, { HasErrorsWithin, Value } from "svelte-zod-form";
    import { skillUpdateSchema } from "$lib/mySkills/schemas/skills"
    export let skill: import("$lib/mySkills/schemas/skills").Skill
    export let action = ""
    export let entry = ""
    $: mainStyles = $MainStyles
    const updatingSkill = getQueryStoreKey(page, "updating-skill")
</script>

<div class="updatable-project-card">
    <h3>{skill.name}</h3>
    {#if $updatingSkill !== skill.name}
        <a href="?updating-skill={skill.name}" on:click|preventDefault={() => {
            $updatingSkill = skill.name
        }}>update</a>
    {/if}
    {#if $updatingSkill !== skill.name}
        <div>
            <svg use:svgExtend={skill.logo}></svg>
        </div>
        <div>
            <span>linkedin link:</span> <span>{skill.linkedInAssesment?.url ?? "none"}</span>
            {#if skill.certificate == null}
                <span>certificate:</span> <span>none</span>
            {:else}
                <span>certificate text:</span> <span>{skill.certificate?.text ?? ""}</span>
                <span>certificate link:</span> <span>{skill.certificate?.url ?? ""}</span>
            {/if}
        </div>
    {:else}
        <Form
            schema={skillUpdateSchema}
            {entry}
            let:names
            let:values
            let:validation
            let:errors
            let:FormError
        >
            <form
                {action}
                method="post"
                use:validation
                enctype="multipart/form-data"
            >
                <input type="hidden" name={names.name[Value]} value={skill.name}>            
                <input type="hidden" name={names.certificateId[Value]} value={skill.certificate?.id ?? ""}>
                <input type="hidden" name={names.linkedInAssesmentId[Value]} value={skill.linkedInAssesment?.id ?? ""}>
                <div>
                    <div>
                        <label for="logo-{skill.name}">logo</label>
                        <input
                            type="file"
                            id="logo-{skill.name}"
                            name={names.logo[Value]}
                        >
                    </div>
                    <FormError errors={errors.logo} let:errors>
                        <ul class="errors">
                            {#each errors as error}
                                <li>{error}</li>
                            {/each}
                        </ul>
                    </FormError>
                </div>
                <div>
                    <label for="linkedin-link-{skill.name}">linkedin link</label>
                    <input
                        type="url"
                        id="linkedin-link-{skill.name}"
                        name={names.linkedInAssesment[Value]}
                        value={values.linkedInAssesment || (skill.linkedInAssesment?.url ?? "")}
                    >
                    <FormError errors={errors.linkedInAssesment} let:errors>
                        <ul class="errors">
                            {#each errors as error}
                                <li>{error}</li>
                            {/each}
                        </ul>
                    </FormError>
                </div>
                <div>
                    <label for="certificate-text-{skill.name}">certificate text</label>
                    <input
                        type="text"
                        id="certificate-text-{skill.name}"
                        name={names.certificate.text[Value]}
                        value={values.certificate?.text || (skill.certificate?.text ?? "")}
                    >
                    <FormError errors={errors.certificate?.text} let:errors>
                        <ul class="errors">
                            {#each errors as error}
                                <li>{error}</li>
                            {/each}
                        </ul>
                    </FormError>
                </div>
                <div>
                    <label for="certificate-url-{skill.name}">certificate url</label>
                    <input
                        type="text"
                        id="certificate-url-{skill.name}"
                        name={names.certificate.url[Value]}
                        value={values.certificate?.url || (skill.certificate?.url ?? "")}
                    >
                    <FormError errors={errors.certificate?.url} let:errors>
                        <ul class="errors">
                            {#each errors as error}
                                <li>{error}</li>
                            {/each}
                        </ul>
                    </FormError>
                </div>
                {errors[HasErrorsWithin]}
                <div class="control">
                    <button>update</button>
                    <a
                        href={$page.url.pathname.toString()}
                        on:click|preventDefault={() => {
                            $updatingSkill = null
                        }}
                        class="btn"
                    >cancel</a>
                </div>
            </form>
        </Form>
    {/if}
</div>

<style lang="sass">
    .updatable-project-card
        width: fit-content
        display: flex
        flex-direction: column
        align-items: center
        padding: 1em
        border-radius: 1em
        border: solid 0.2em var(--mainStyles-fontHighlightColors-_0)
        margin: 0.5em
        h3
            text-align: center
        svg
            width: min(30ch, 80vw)
            height: auto
            margin: 1em
        & > div
            display: grid
            grid-template-columns: auto 1fr
            width: 100%
            gap: 0.2em
            span
                display: block
                padding-inline: 0.5em
            span:nth-child(2n+1)
                text-align: right
                background-color: var(--mainStyles-fontHighlightColors-_0)
                color: black
                border-radius: 0.2em 0 0 0.2em
            span:nth-child(2n)
                background-color: var(--mainStyles-fontHighlightColors-_1)
                color: black
                padding-inline: 0.5em
                border-radius: 0 0.2em 0.2em 0
            span:first-child
                border-top-left-radius: 0.5em
            span:nth-child(2)
                border-top-right-radius: 0.5em
            span:nth-last-child(2)
                border-bottom-left-radius: 0.5em
            span:last-child
                border-bottom-right-radius: 0.5em
    form 
        padding: 0
        input 
            width: 100%
        div
            width: 100%
        .control
            display: flex
            *
                flex: 1
                border-radius: 0.2em
                &:first-child
                    border-bottom-left-radius: 0.5em
                &:last-child
                    border-bottom-right-radius: 0.5em

</style>
