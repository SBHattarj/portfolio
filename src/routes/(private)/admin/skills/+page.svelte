<script>
    import SkillCreateForm from "$lib/mySkills/components/SkillCreateForm";
    import UpdatableSkill from "$lib/mySkills/components/UpdatableSkill";
    export let data;
    console.log(data)
</script>

<SkillCreateForm action="?/createSkill"/>

{#each data.skills as skill}
    <UpdatableSkill
        {skill}
        action="?/updateSkill"
        entry={"update-skill"}
    />
{/each}
