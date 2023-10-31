<script context="module">
    const renderer = writable({})
</script>
<script lang="ts">
    import {insertProjectTypeSchema} from "$lib/myProjects/schemas/projects"
    import Form, { Errors, HasErrors, Value } from "svelte-zod-form";
    import { getQueryStoreKey } from "$lib/core/stores/QueryStore"
    import { page } from "$app/stores"
    import type { ProjectType } from "$lib/myProjects/schemas/projects";
	import { slide } from "svelte/transition";
	import { flip } from "svelte/animate";
	import { writable } from "svelte/store";
    export let projectType: ProjectType & { projects: number }
    export let action = ""
    const updatingProjectType = getQueryStoreKey(page, "updating-project-type")
    $: currentlyUpdating = $updatingProjectType === projectType.name && $renderer
    $: url = $page.url.pathname
    export let entry: string | null = null
</script>

<div class="project-type">
        <h2>{projectType.name}</h2>
        <p>Project Count: {projectType.projects}</p>
        {#if currentlyUpdating}
            <div transition:slide={{duration: 400, axis: 'x'}}>
                <div transition:slide|global={{duration: 400}}>
                    <Form 
                        schema={insertProjectTypeSchema}
                        {entry}
                        let:validation
                        let:names
                        let:FormError
                        let:errors
                        let:values
                    >
                        <form {action} method="post" use:validation>
                            <div>
                                <div>
                                    <label for="color-update">color</label>
                                    <input value={values.color || projectType.color} name={names.color[Value]} id="color-update" type="color">
                                </div>
                                <FormError errors={errors.color} let:errors>
                                    <ul class="errors" transition:slide={{duration: 300}}>
                                        {#each new Set(errors) as error (error)}
                                            <li animate:flip={{duration: 300}}>{error}</li>
                                        {/each}
                                    </ul>
                                </FormError>
                            </div>
                            <input type="hidden" name={names.name[Value]} value={projectType.name}>
                            <div>
                                <button>Update</button>
                                <a class="btn" href="{url}" on:click|preventDefault={e => {
                                    $updatingProjectType = null
                                }}>cancel</a>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            
        {:else}
            <a 
                href="{url}?updating-project-type={projectType.name}"
                transition:slide={{duration: 400}}
                on:click|preventDefault={e => {
                    $updatingProjectType = projectType.name
                }}
            >update</a>
        {/if}
        <a href="{url}/{projectType.name}">Edit Projects</a>
</div>

<style lang="sass">
    h2
        margin-bottom: 0.01em
    div
        color: var(--projectType-color)
        a
            color: var(--projectType-color)
        form
            width: min(80vw, 30ch)
            padding-left: 0.8rem

            &>div
                margin-left: 0
                width: 100%
                >div
                    width: 100%
                    box-sizing: border-box
            a
                float: right
            div:has(button+a)
                display: flex
                flex-direction: row
                gap: 1em
                :is(button, a)
                    flex: 1
    .project-type
        padding-bottom: 1em
        display: flex
        flex-direction: column
        align-items: center
        border: 1px solid var(--projectType-color)
        padding: 1em
        border-radius: 1em
        width: fit-content
        gap: 0.6em

</style>
