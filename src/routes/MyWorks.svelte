<script lang="ts">
    import Project from "$lib/myProjects/components/Project"
    import J from 'jquery'
    import Carousel from "$lib/myProjects/components/Carousel/Carousel.svelte";
	import { sleep } from "$lib/core/utils/async";
    let stagger = 0
    let websites = [
        {
            name: "portfolio",
            description: "Portfolio",
            url: "/",
            creationDate: Date.now(),
        },
        {
            name: "portfolio",
            description: "Portfolio",
            url: "/",
            creationDate: Date.now(),
        },
        {
            name: "portfolio",
            description: "Portfolio",
            url: "/",
            creationDate: Date.now(),
        },
        {
            name: "portfolio",
            description: "Portfolio",
            url: "/",
            creationDate: Date.now(),
        },
        {
            name: "portfolio",
            description: "Portfolio",
            url: "/",
            creationDate: Date.now(),
        },
        {
            name: "portfolio",
            description: "Portfolio",
            url: "/",
            creationDate: Date.now(),
        },
    ]
    let firstScroller: HTMLElement
    let secondScroller: HTMLElement
    let wheelEvent: ReturnType<typeof setTimeout>
</script>

<!--div
    style:width="100%"
    style:overflow="hidden"
>
    <div
        class="websites"
        style:white-space="nowrap"
        style:width="100%"
        style:overflow="scroll"
        style:box-sizing="border-box"
        style:scroll-snap-type="x mandatory"
        style:position="absolute"
        bind:this={firstScroller}
    >
        {#each websites as website, index}
            <Project projectData={website} 
                on:offsetChange={async (e) => {

                    if(e.target == null) return
                    if(!(e.target instanceof HTMLElement)) return
                    J(e.target).css("opacity", 0)
                    const target = J(`[data-project-index="${index}"]`)
                        .css(
                            "translate", `calc(${
                                e.detail.offset.x
                            }px - 5rem) calc(${
                                e.detail.offset.y
                            }px - 4rem)`
                        )
                    const offsetFromCenter = e.detail.offset.x - e.detail.container.clientWidth / 2
                        + e.detail.offset.width / 2
                    
                    const scale = (Math.abs(e.detail.container.clientWidth / offsetFromCenter) ** 2) / 8 
                    const side = offsetFromCenter !== 0 
                        ? offsetFromCenter / Math.abs(offsetFromCenter) : 0
                    
                    
                    if(Math.abs(scale) < 1) J(target)
                        .css("scale", Math.abs(scale).toString())
                        .css("pointer-events", "none")
                        .attr("data-pointer-events", "none")
                        .css("opacity", Math.abs(scale).toString())
                    else {
                        J(target)
                            .css("scale", "")
                            .attr("data-pointer-events", "all")
                            .css("opacity", "")
                        clearTimeout(wheelEvent)
                        wheelEvent = setTimeout(() => {
                            J(target).css(
                                "pointer-events", 
                                J(target).attr("data-pointer-events") ?? "all"
                            )
                        })
                    }
                    J(target)
                        .css(
                            "translate", 
                            `calc(${
                                e.detail.offset.x
                                - offsetFromCenter 
                                + Math.min(((1/scale) ** 0.1) ** 0.1, 2) * offsetFromCenter / 2
                            }px - 5rem) calc(${e.detail.offset.y}px - 4rem)`
                        )
                        .css(
                            "z-index", 
                            `${Math.abs(Math.ceil(Math.min(5, ((1/offsetFromCenter) ** 0.5) * 50)))}`
                        )
                }}
            />
        {/each}
        
    </div>
    {#each websites as website, index}
        <div
            style:position="absolute"
            style:top="0"
            style:left="0"
            data-project-index={index}
            on:wheel={e => {
                let target = J(`[data-project-index="${index}"]`).css("pointer-events", "none")
                clearTimeout(wheelEvent)
                wheelEvent = setTimeout(() => {
                    console.log("scroll-main")
                    J(target).css("pointer-events", J(target).attr("data-pointer-events") || "all")
                },200)

            }}
            on:pointermove={() => {
                let target = J(`[data-project-index="${index}"]`).css("pointer-events", "none")
                clearTimeout(wheelEvent)
                wheelEvent = setTimeout(() => {
                    console.log("scroll-main")
                    J(target).css("pointer-events", J(target).attr("data-pointer-events") || "all")
                },200)

            }}
        >
            <Project 
                projectData={website} 
            />
        </div>
    {/each}
</div-->
<Carousel
    centerCheck={({x}, fullWidth) => {
        let scaling = Math.abs(((fullWidth / x) ** 2) / 200)
        return scaling > 1
    }} 
    on:scroll-animate={e => {
        const scale = Math.abs((e.detail.parentDimensions.width / e.detail.distanceFromCenter.x ** 2) / 2000)
        const translate = -e.detail.distanceFromCenter.x

        J(e.detail.target)
            .css("scale", Math.min(scale, 1).toString())
            .css("pointer-events", "none")
            .css("transform-origin", "center")
            .css("translate", `${translate}px`)
    }}
    on:scroll-center={e => {
        J(e.detail.target)
            .css("scale", "1")
            .css("pointer-events", J(e.detail.target).attr("data-pointer-events") ?? "all")
            .css("translate", "0")
    }}
>
    <div
        class="websites"
        style:white-space="nowrap"
        style:width="100%"
        style:overflow="scroll"
        style:box-sizing="border-box"
        style:scroll-snap-type="x mandatory"
        bind:this={firstScroller}
    >
        {#each websites as website}
            <Project 
                projectData={website} 
            />
        {/each}
    </div>
</Carousel>
<!--div
    class="websites second"
    style:white-space="nowrap"
    style:width="100%"
    style:overflow="scroll"
    style:pointer-events="none"
    style:box-sizing="border-box"
    bind:this={secondScroller}
>
    {#each websites as website}
        <Project 
            projectData={website} 
            on:wheel={e => {
                console.log(e)
                let target = J(e.detail.container)
                target.css("pointer-events", "none")
                console.log("wheel")
                clearTimeout(wheelEvent)
                wheelEvent = setTimeout(() => {
                    console.log("scroll")
                    target.css("pointer-events", "")
                },200)
            }}

            on:offsetChange={async (e) => {
            if(e.target == null) return
            if(!(e.target instanceof HTMLElement)) return
            const offsetFromCenter = e.detail.offset.x - e.detail.container.clientWidth / 2
                + e.detail.offset.width / 2
            
            const scale = (Math.abs(e.detail.container.clientWidth / offsetFromCenter) ** 2) / 8 
            const side = offsetFromCenter !== 0 
                ? offsetFromCenter / Math.abs(offsetFromCenter) : 0
            
            
            if(Math.abs(scale) < 1) J(e.target).children(".project-card")
                .css("scale", Math.abs(scale).toString())
                .css("pointer-events", "none")
                .css("opacity", Math.abs(scale).toString())
            else J(e.target).children(".project-card")
                .css("pointer-events", "all")
                .css("scale", "")
                .css("opacity", "")
            J(e.target).children(".project-card")
                .css(
                    "translate", 
                    `${
                        -offsetFromCenter 
                        + Math.min(((1/scale) ** 0.1) ** 0.1, 2) * offsetFromCenter / 2
                    }px`
                )
                .css("z-index", `${Math.abs(Math.ceil(Math.min(5, ((1/offsetFromCenter) ** 0.5) * 50)))}`)
        }}/>
    {/each}
</div-->

<style lang="sass">
    .websites
        position: relative
        &.second
            scrollbar-color: transparent transparent
</style>
