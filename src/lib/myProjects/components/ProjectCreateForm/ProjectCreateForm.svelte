<script lang="ts">
    import { insertProjectSchema } from "$lib/myProjects/schemas/projects";
	import Form, { Value, date } from "svelte-zod-form";
	import { flip } from "svelte/animate";
	import { slide } from "svelte/transition";
    export let type: string;
    export let action: string = "";
    export let entry: string | null = null;
</script>
<h2>Add Project to {type}</h2>

<Form
    {entry}
    schema={insertProjectSchema}
    let:validation
    let:values
    let:errors
    let:FormError
    let:names
>
    <form method="post" action={action} use:validation>
        <div>
            <label for="name">name</label>
            <input 
                id="name"
                name={names.name[Value]}
                value={values.name}
                type="text"
                placeholder=" "
            >
            <FormError errors={errors.name} let:errors>
                <ul class="errors" transition:slide>
                    {#each errors as error (error)}
                        <li animate:flip={{duration: 300}}>{error}</li>
                    {/each}
                </ul>
            </FormError>
        </div>
        <div>
            <label for="description">description</label>
            <textarea
                id="description"
                name={names.description[Value]}
                rows="7"
            >{values.description}</textarea>
            <FormError errors={errors.description} let:errors>
                <ul class="errors" transition:slide>
                    {#each errors as error (error)}
                        <li animate:flip={{duration: 300}}>{error}</li>
                    {/each}
                </ul>
            </FormError>
        </div>
        <div>
            <label for="url">url</label>
            <input 
                id="url"
                name={names.url[Value]}
                value={values.url}
                type="url"
                placeholder=" "
            >
            <FormError errors={errors.url} let:errors>
                <ul class="errors" transition:slide>
                    {#each errors as error (error)}
                        <li animate:flip={{duration: 300}}>{error}</li>
                    {/each}
                </ul>
            </FormError>
        </div>
        <div>
            <label for="creation-date">creation date</label>
            <input 
                id="creation-date"
                name={names.creationDate[Value]}
                value={date(values.creationDate || new Date())}
                type="date"
            >
            <FormError errors={errors.creationDate} let:errors>
                <ul class="errors" transition:slide>
                    {#each errors as error (error)}
                        <li animate:flip={{duration: 300}}>{error}</li>
                    {/each}
                </ul>
            </FormError>
        </div>
        <input type="hidden" value={type} name={names.type?.[Value]}>
        <button>Add</button>
    </form>
</Form>
