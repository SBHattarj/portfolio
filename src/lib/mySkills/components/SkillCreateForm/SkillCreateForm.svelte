<script lang="ts">
import { skillCreateSchema } from "$lib/mySkills/schemas/skills";

    import Form, { Value } from "svelte-zod-form";
    export let entry: string | null = null
    export let action = ""
    let data: any;
</script>
<div>
    <h2>Create Skill</h2>
    <Form
        schema={skillCreateSchema}
        {entry}
        let:names
        let:errors
        let:validation
        let:values
        let:FormError
        bind:data
    >
        <form {action} use:validation method="post" enctype="multipart/form-data">
            <div>
                <div>
                    <label for="logo">logo</label>
                    <input
                        type="file"
                        id="logo"
                        name={names.logo[Value]}
                        accept=".svg"
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
                <label for="name">name</label>
                <input
                    type="text"
                    id="name"
                    name={names.name[Value]}
                    value={values.name}
                >
                <FormError errors={errors.name} let:errors>
                    <ul class="errors">
                        {#each errors as error}
                            <li>{error}</li>
                        {/each}
                    </ul>
                </FormError>
            </div>
            <div>
                <label for="linkedAssesment">linked in assesment</label>
                <input
                    type="url"
                    id="linkedAssesment"
                    name={names.linkedInAssesment?.[Value]}
                    value={values.linkedInAssesment}
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
                <label for="certificate-text">certificate name</label>
                <input
                    type="text"
                    id="certificate-text"
                    name={names.certificate?.text[Value]}
                    value={values.certificate?.text}
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
                <label for="certificate-url">certificate url</label>
                <input
                    type="url"
                    id="certificate-url"
                    name={names.certificate?.url[Value]}
                    value={values.certificate?.url}
                >
                <FormError errors={errors.certificate?.url} let:errors>
                    <ul class="errors">
                        {#each errors as error}
                            <li>{error}</li>
                        {/each}
                    </ul>
                </FormError>
            </div>
            <button>create</button>
        </form>
    </Form>
</div>
