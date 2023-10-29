<script lang="ts">
    import Form, { Value } from "svelte-zod-form"
    import { insertProjectTypeSchema } from "$lib/myProjects/schemas/projects"
    import { flip } from "svelte/animate";
    import { slide } from "svelte/transition";
    export let action = ""
    export let entry: string | null = null
    import { MainStyles } from "$lib/core/stores/styles";
    $: mainStyles = $MainStyles
</script>

<Form
    realTime
    schema={insertProjectTypeSchema}
    {entry}
    let:names
    let:values
    let:errors
    let:validation
    let:FormError
>
    <h2>Create new Project type</h2>
    <form use:validation method="post" {action}>
        <div>
            <label for="name">Name</label>
            <input placeholder=" " type="text" name={names.name[Value]} id="name" value={values.name}>
            <FormError errors={errors.name} let:errors>
                <ul class="errors" transition:slide={{duration: 300}}>
                    {#each new Set(errors) as error (error)}
                        <li animate:flip={{duration: 300}}>{error}</li>
                    {/each}
                </ul>
            </FormError>
        </div>
        <div>
            <div>
                <label for="color">color</label>
                <input type="color" name={names.color[Value]} id="color" value={values.color || "#000000"}>
            </div>
            <FormError errors={errors.color} let:errors>
                <ul class="errors" transition:slide={{duration: 300}}>
                    {#each new Set(errors) as error (error)}
                        <li animate:flip={{duration: 300}}>{error}</li>
                    {/each}
                </ul>
            </FormError>
        </div>
        <button>Create</button>
    </form>
</Form>


<style lang="sass">
    form
        padding-bottom: 0.8rem
        margin-bottom: 0.8rem
        border-bottom: 0.1rem solid var(--mainStyles-fontHighlightColors-_0)
</style>
