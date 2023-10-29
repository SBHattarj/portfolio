<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { getQueryStoreKey } from "$lib/core/stores/QueryStore";
    import ProjectType from "$lib/myProjects/components/ProjectType/ProjectType.svelte";
    import ProjectTypeCreateForm from "$lib/myProjects/components/ProjectTypeCreateForm/ProjectTypeCreateForm.svelte";
	import { flip } from "svelte/animate";
    import { fade, slide } from "svelte/transition";
    export let data;
    const searchParam = getQueryStoreKey(page, "search-project-type")
    $: projectTypes = data.projectTypes.filter((projectType) => {
        const searchStrings = $searchParam?.toLowerCase().split(" ") ?? []
        return searchStrings.every(
            searchString => 
                projectType.name.toLowerCase().includes(searchString)
                || projectType.color.toLowerCase().includes(searchString)
        )
    })
</script>

<ProjectTypeCreateForm action="?/createProjectType" />

<form>
    <div>
        <label for="search-project-type">search</label>
        <input 
            id="search-project-type"
            placeholder=" "
            bind:value={$searchParam}
            type="search"
            name={searchParam.name}
        >
    </div>
    <button style:display={browser ? "none" : "block"} transition:slide>search</button>
</form>
<div class="types-container">
    {#each projectTypes as projectType (projectType.name)}
        <div animate:flip={{duration: 400}} out:fade>
            <ProjectType {projectType} entry="update-project-type" action="?/updateProjectType" />
        </div>
    {/each}
</div>

<style lang="sass">
    .types-container
        display: flex
        gap: 0.5em
        padding-left: 0.8em
        align-items: center
</style>
