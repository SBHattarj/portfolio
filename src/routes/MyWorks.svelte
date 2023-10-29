<script lang="ts">
    import Project from "$lib/myProjects/components/Project"
    import J from 'jquery'
    import Carousel from "$lib/myProjects/components/Carousel/Carousel.svelte";
    import type { 
        CenterCheck,
        ScrollAnimateDetail,
        ScrollCenterDetail
    } from "$lib/myProjects/components/Carousel/Carousel.svelte";
    import type { PageData } from "./$types"


    export let projects: PageData["projects"];

    function scrollAnimation(e: CustomEvent<ScrollAnimateDetail>) {
        let scale = (
            (
                e.detail.parentDimensions.width / e.detail.distanceFromCenter.x
            ) 
            ** 2
        ) / 20
        
        let side = e.detail.distanceFromCenter.x / Math.abs(e.detail.distanceFromCenter.x) * 300

        const translate = -e.detail.distanceFromCenter.x 
            + side 
            * e.detail.parentDimensions.width 
            / (scale ** 0.5) 
            / 1600

        J(e.detail.target)
            .css("scale", Math.min(scale, 0.9).toString())
            .css("pointer-events", "none")
            .css("transform-origin", "center")
            .css("translate", `${translate}px`)
            .css("opacity", Math.max(Math.min(1, scale), 0.4))
        e.detail.setZIndex(Math.min(1, scale))
    }
    function scrollCenter(e: CustomEvent<ScrollCenterDetail>) {
        J(e.detail.target)
            .css("scale", "1")
            .css("pointer-events", "all")
            .css("translate", "0")
        e.detail.setZIndex(2)
    }
    const centerCheck: CenterCheck = function centerCheck({x}, fullWidth) {
        let scaling = Math.abs(((fullWidth / x) ** 2) / 200)
        return scaling > 1
    }
</script>

{#each projects as [key, value] (key)}
    <h3
    >
        <i style:--color={value.color}>{key}</i>
    </h3>
    <div>
        <Carousel
            {centerCheck}
            on:scroll-animate={scrollAnimation}
            on:scroll-center={scrollCenter}
            spaceDisplay="inline-block"
            padding="5ch"
        >
            <div
                style:white-space="nowrap"
                style:position="relative"
                style:width="100%"
                style:overflow="auto"
                style:box-sizing="border-box"
                style:scroll-snap-type={import.meta.env.SSR ? "none" : "x mandatory"}
                style:padding-block="4ch"
            >
                {#if !import.meta.env.SSR}
                    <div
                        style:display="inline-block"
                        style:width="calc(2.8rem + 40ch)"
                        style:margin-inline="5rem"
                        class="padding"
                    ></div>
                    <div
                        style:display="inline-block"
                        style:width="calc(2.8rem + 40ch)"
                        style:margin-inline="5rem"
                        class="padding"
                    ></div>
                {/if}
                {#each value.projects as website}
                    <Project
                        projectData={website}
                        descriptionColor={value.color}
                        marginLeft="9rem"
                    />
                {/each}
                {#if !import.meta.env.SSR}
                    <div
                        style:display="inline-block"
                        style:width="calc(2.8rem + 40ch)"
                        style:margin-inline="5rem"
                        class="padding"
                    ></div>
                    <div
                        style:display="inline-block"
                        style:width="calc(2.8rem + 40ch)"
                        style:margin-inline="5rem"
                        class="padding"
                    ></div>
                {/if}
            </div>
        </Carousel>
    </div>
{/each}

<style lang="sass">
    h3
        font-size: 2rem
        text-align: center
        border-bottom: 1px solid linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)
        margin-block: 4rem
    h3 > i
        color: var(--color)
        display: inline-block
        padding-inline: 4em
        border-bottom: 1px solid
        border-image: linear-gradient(90deg, transparent, var(--color), transparent) 1
</style>

