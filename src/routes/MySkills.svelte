<script lang="ts">
    import { MainStyles } from "$lib/core/stores/styles";
    import MySkillCard from "$lib/mySkills/components/MySkillCard.svelte";
	import { tick } from "svelte";
	import type { PageData } from "./$types";
    import { svgExtend } from "$lib/core/utils/svg";

    export let skills: PageData["skills"];
    let allEllements = [] as HTMLElement[]
    let paddingRight = 0
    let rootWidth = 0
    function getFurthest(node: HTMLElement) {
        allEllements.push(node)
        allEllements = allEllements
        return {
            destroy() {
                allEllements = allEllements.filter(el => el !== node)
            }
        }
    }
    $: {
        let furthestEllement: HTMLElement | null = null
        for(let node of allEllements) {
            if(furthestEllement == null) {
                furthestEllement = node
            }
            if(furthestEllement.offsetLeft < node.offsetLeft) {
                furthestEllement = node
            }
        }
        tick().then(() => {
            paddingRight = (rootWidth - (furthestEllement?.offsetLeft ?? 0) - (furthestEllement?.clientWidth ?? 0))
        })
    }

    $: mainStyles = $MainStyles
</script>

<div 
    class="my-skill-root"
    bind:clientWidth={rootWidth}
>
    {#each skills as {name, linkedInAssesment, certificate, logo} (name)}
        <div
            style:width="fit-content"
            use:getFurthest
        >
            <MySkillCard
                {name}
                {linkedInAssesment}
                {certificate}
                visible={false}
            >
                <svg width="80%" height="auto" use:svgExtend={logo} />
            </MySkillCard>
        </div>
    {/each}
    <div
        style:position="absolute"
        style:left="0"
        style:right="0"
        style:top="0"
        style:display="flex"
        style:flex-wrap="wrap"
        style:padding-right="{paddingRight}px"
        style:gap={mainStyles.spacing.normal}
    >
        {#each skills as {name, linkedInAssesment, certificate, logo} (name)}
            <MySkillCard
                {name}
                {linkedInAssesment}
                {certificate}
            >
                <svg width="80%" style:aspect-ratio="1" height="auto" use:svgExtend={logo} />
                
            </MySkillCard>
        {/each}
    </div>
</div>

<style lang="sass">
    .my-skill-root
        display: flex
        gap: var(--mainStyles-spacing-normal)
        flex-wrap: wrap
        position: relative
        width: fit-content
</style>
