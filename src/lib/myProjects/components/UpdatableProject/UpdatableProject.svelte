<script context="module">
    const renderer = writable({})
</script>
<script lang="ts">
	import { type Project, insertProjectSchema} from "$lib/myProjects/schemas/projects";
    import { MainStyles } from "$lib/core/stores/styles";
    import { page } from "$app/stores";
	import { slide } from "svelte/transition";
	import Form, { Value, date } from "svelte-zod-form";
	import { writable } from "svelte/store";
	import { getQueryStoreKey } from "$lib/core/stores/QueryStore";
    export let project: Project
    export let action = ""
    export let entry: string | null = null
    $: mainStyles = $MainStyles
    $: url = $page.url.pathname
    const updatingProject = getQueryStoreKey(page, "updating-project")
    $: isUpdating = $updatingProject === project.id.toString()
</script>

<div class="updatable-project">
    <div class="header">
        <h3>{project.name}</h3>
        {#if isUpdating}
            <a href={url} on:click|preventDefault={e => {
                $updatingProject = null
            }}>cancel</a>
        {:else}
            <a href="?updating-project={project.id}" on:click|preventDefault={e => {
                $updatingProject = project.id.toString()
            }}>update</a>
        {/if}
    </div>
    {#if !isUpdating}
        <div transition:slide={{duration: 400}}>
            <p>{project.description}</p>
            <div class="details">
                <span>type:</span> <span>{project.type}</span>
                <span>link:</span> <span>{project.url}</span>
                <span>Created At:</span> <span>{project.creationDate}</span>
            </div>
        </div>
    {:else}
        <div transition:slide>
            <Form 
                schema={insertProjectSchema}
                {entry}
                let:validation
                let:names
                let:values
                let:FormError
                let:errors
            >
                <form {action} method="post" use:validation on:validate-data={e=> {
                    e.detail.data.id = project.id
                    e.detail.data.description ||= project.description
                    e.detail.revalidate(e.detail.data)
                }}>
                    <input type="hidden" name={names.id?.[Value]} value={project.id}>
                    <input type="hidden" name={names.name[Value]} value={project.name} >
                    <div>
                        <label for="description-{project.id}">description</label>
                        <textarea 
                            name={names.description[Value]} 
                            id="description-{project.id}"
                            cols="30"
                            rows="10"
                        >{values.description || project.description}</textarea>
                        <FormError errors={errors.description} let:errors>
                            <ul class="errors">
                                {#each errors as error}
                                    <li>{error}</li>
                                {/each}
                            </ul>
                        </FormError>
                    </div>
                    <div>
                        <label for="link-{project.id}">link</label>
                        <input
                            type="url"
                            id="link-{project.id}"
                            name={names.url[Value]}
                            value={values.url || project.url}
                        >
                        <FormError errors={errors.url} let:errors>
                            <ul class="errors">
                                {#each errors as error}
                                    <li>{error}</li>
                                {/each}
                            </ul>
                        </FormError>
                    </div>
                    <div>
                        <label for="createdAt-{project.creationDate}">created at</label>
                        <input
                            type="date"
                            id="createdAt-{project.creationDate}"
                            name={names.creationDate[Value]}
                            value={date(values.creationDate || project.creationDate)}
                        >
                        <FormError errors={errors.creationDate} let:errors>
                            <ul class="errors">
                                {#each errors as error}
                                    <li>{error}</li>
                                {/each}
                            </ul>
                        </FormError>
                    </div>
                    <button>update</button>
                </form>
            </Form>
        </div>
    {/if}
</div>

<style lang="sass">
    .updatable-project
        width: min(45ch, 80%)
        padding: 0.5rem
        margin: 0.5rem
        border: 1px solid var(--mainStyles-fontHighlightColors-_1)
        border-radius: 1.5em
        form
            padding: 0.3em
            input, textarea, button
                width: 100%
                border-radius: 0.5em
            button
                margin: 0
                margin-top: 0.5em
                border-radius: 0.5em 0.5em 1em 1em
        .header
            display: flex
            flex-direction: rows
            gap: 0.5em
            h3
                flex: 1
                border: 1px solid var(--mainStyles-fontHighlightColors-_1)
                padding: 1em
                border-radius: 1em 0 0 0.5em
                margin: 0em
            a
                border-radius: 0 1em 0.5em 0
                outline-width: 0
                border: 0.2em solid var(--mainStyles-fontColor-highlight)
                display: flex
                align-items: center
                margin: 0
                &:hover, &:focus-visible
                    outline-width: 0.3em
        .details
            display: grid
            align-items: center
            grid-template-columns: auto 1fr
            gap: 0.5rem
            > span
                min-width: 0
                overflow-wrap: break-word
                box-sizing: border-box
            >:nth-child(2n + 1)
                text-wrap: none
                width: 100%
                background-color: var(--mainStyles-fontHighlightColors-_1)
                color: black
                padding: 0.2em
                font-weight: bold
                height: 100%
                border-radius: 0.5em 0 0 0.5em
                padding-left: 0.5em
                display: flex
                align-items: center
                justify-content: left
            >:first-child
                border-top-left-radius: 1em
            >:nth-last-child(2)
                border-bottom-left-radius: 1em
            >:nth-child(2n)
                background-color: var(--mainStyles-fontHighlightColors-_0)
                color: black
                padding-left: 0.2em
                border-radius: 0 0.5em 0.5em 0
                padding-right: 1em
            >:nth-child(2)
                border-top-right-radius: 1em
            >:last-child
                border-bottom-right-radius: 1em

</style>
