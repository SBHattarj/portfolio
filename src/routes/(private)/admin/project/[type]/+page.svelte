<script>
    import ProjectCreateForm from "$lib/myProjects/components/ProjectCreateForm/ProjectCreateForm.svelte";
    import { page } from "$app/stores";
	import UpdatableProject from "$lib/myProjects/components/UpdatableProject/UpdatableProject.svelte";
	import { browser } from "$app/environment";
	import { getQueryStoreKey } from "$lib/core/stores/QueryStore";
    export let data;
    const searchParam = getQueryStoreKey(page, "search-project")
    $: projects = data.projects.filter((project) => {
        const searchStrings = $searchParam?.toLowerCase().split(" ") ?? [];
        return searchStrings.every(
            searchString =>
                project.name.toLowerCase().includes(searchString) ||
                project.description.toLowerCase().includes(searchString)
        )
    })
</script>
<ProjectCreateForm type={$page.params.type} action="?/createProject" />
<hr>
<form>
    <div>
        <label for="search-project">search</label>
        <input 
            id="search-project"
            placeholder=" "
            bind:value={$searchParam}
            type="search"
            name={searchParam.name}
        >
    </div>
    <button style:display={browser ? "none" : "block"}>search</button>
</form>
<div class="projects">
    {#each projects as project (project.id)}
        <UpdatableProject action="?/updateProject" {project} entry="updateProject" />
    {/each}
</div>

<style lang="sass">
    .projects
        display: flex
        flex-wrap: wrap
        align-items: center
</style>
