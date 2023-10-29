<script context="module" lang="ts">
    export type Offset = {x: number, y: number}
    export type ScrollAnimateDetail = {
            distanceFromCenter: Offset,
            parentDimensions: {width: number, height: number},
            childDimensions: {width: number, height: number},
            parent: HTMLElement,
            target: HTMLElement
            setZIndex(index: number): void
    }
    export type ScrollCenterDetail = {
        target: HTMLElement,
        setZIndex(index: number): void
    }
    export type CenterCheck = (distanceFromCenter: Offset, fullWidth: number, fullHeight: number) => boolean
</script>
<script lang="ts">
    import J from "jquery"
    import toPX from "to-px"
	import { createEventDispatcher, onMount } from "svelte";
	import SideCodePanel from "server:/routes/SideCodePanel.svelte";
    export let controllButtons: boolean = false
    export let padding: string | number = 0
    export let initialOffset: {x: string | number, y: string | number} = {x: 0, y: 0}
    const dispatch = createEventDispatcher<{
        "scroll-animate": ScrollAnimateDetail,
        "scroll-center": ScrollCenterDetail
    }>()
    export let spaceDisplay: string = "block"
    export let centerCheck: CenterCheck = function (distanceFromCenter, fullWidth, fullHeight) {

        const scalingX = ((fullWidth / distanceFromCenter.x) ** 2) / 20
        const scalingY = ((fullHeight / distanceFromCenter.y) ** 2) / 20
        return scalingX > 1 && scalingY > 1
    }
    let mountedInJs = false
    onMount(() => {
        mountedInJs = true
    })
    
    function scrollCB(node: HTMLElement, carouselRoot: HTMLElement) {
        const target = J(node)
        target.css("scroll-behavior", "smooth")
        const carouselDisplay = J(carouselRoot).next(".carousel-display")
        if(target.children(".space").length < 1) {
            target.append(`<div 
                class="space"
                style="width: ${
                    typeof initialOffset.x === "number"
                    ? `${initialOffset.x}px`
                    : initialOffset.x
                }; height: ${
                    typeof initialOffset.y === "number"
                    ? `${initialOffset.y}px`
                    : initialOffset.y
                }; display: ${spaceDisplay};"
            ></div>`)
        }

        const children = target.children().not(".space")
        children
            .css("opacity", "0")
            .css("pointer-events", "none")
            .find("*")
        children.each(function (index, childDom) {
            const child = J(this)
            let displayedChild = carouselDisplay.children().children(`[data-carousel-display-index="${index}"]`)
            displayedChild
                .attr("tabindex", "-1")
                .find("a")
                .attr("tabindex", "-1")
            displayedChild.find("a").on("focus", () => {
            })
            child.find("*").on("focus", function () {
                child.parent().scrollTo(child.prev())
                displayedChild.attr("data-focus", "true")
                J(this).one("blur", () => {
                    displayedChild.removeAttr("data-focus")
                })
            })
            if(displayedChild.length === 0) {
                carouselDisplay
                    .children()
                    .css("overflow", "visible")
                    .children()
                    .eq(index)
                    .wrap(`
                        <div 
                            data-carousel-display-index="${index}"
                            style="position: absolute; top: 0; left: 0;"
                        ></div>
                    `)
                displayedChild = carouselDisplay.children().children(`[data-carousel-display-index="${index}"]`)
                let scroll: ReturnType<typeof setTimeout>
                function allowScroll() {
                    displayedChild.css("pointer-events", "none").find("*").css("pointer-events", "none")
                        .attr("data-pointer-events", "none")
                    clearTimeout(scroll)
                    scroll = setTimeout(() => {
                        displayedChild.css("pointer-events", "all").find("*").css("pointer-events", "all")
                            .attr("data-pointer-events", "all")
                    }, 250)
                }
                displayedChild.on("wheel", allowScroll)
                displayedChild.on("touchmove", allowScroll)
                displayedChild.children().on(
                    "scroll-animate" as any, 
                    (e: CustomEvent<ScrollAnimateDetail>) => {
                        dispatch("scroll-animate", {
                            ...e.detail
                        }
                    )
                })
                displayedChild.children().on(
                    "scroll-center" as any, 
                    (e: CustomEvent<ScrollAnimateDetail>) => {
                        dispatch("scroll-center", {
                            target: e.detail.target,
                            setZIndex(index: number) {
                                displayedChild.css("z-index", index.toString())
                            }
                        })
                })
            }
            const offset = child.position()!
            displayedChild
                .css(
                    "translate",
                    `${
                        offset.left + (
                            typeof initialOffset.x === "number" 
                            ? initialOffset.x 
                            : toPX(initialOffset.x) ?? 0
                        )
                    }px ${
                        offset.top + (
                            typeof initialOffset.y === "number" 
                            ? initialOffset.y 
                            : toPX(initialOffset.y) ?? 0
                        )
                    }px`
                )
            const parentDimensions = {
                width: target.width()!,
                height: target.height()!,
            }
            const childDimensions = {
                width: displayedChild.width()!,
                height: displayedChild.height()!,
            }
            const distanceFromCenter = {
                x: offset.left + (
                    typeof initialOffset.x === "number" 
                    ? initialOffset.x 
                    : toPX(initialOffset.x) ?? 0
                ) - parentDimensions.width / 2 + childDimensions.width / 2,
                y: offset.top + (
                    typeof initialOffset.y === "number" 
                    ? initialOffset.y 
                    : toPX(initialOffset.y) ?? 0
                ) - parentDimensions.height / 2 + childDimensions.height / 2,
            }
            const center = centerCheck(
                distanceFromCenter, 
                parentDimensions.width, 
                parentDimensions.height
            )
            
            if(center) {
                displayedChild.children()[0].dispatchEvent(new CustomEvent(
                    "scroll-center",
                    {
                        detail: {
                            target: displayedChild.children()[0]
                        }
                    }
                ))
                child.attr("data-center", "true")
                return 
            }
            child.removeAttr("data-center")
            
            displayedChild.children()[0].dispatchEvent(new CustomEvent(
                "scroll-animate",
                {
                    detail: {
                        distanceFromCenter,
                        parentDimensions,
                        childDimensions,
                        parent: parent[0],
                        target: displayedChild.children()[0],
                        setZIndex(index: number) {
                            displayedChild.css("z-index", index.toString())
                        }
                    }
                }
            ))
        })

    }
    let scroller: HTMLElement
    export function scrollNext() {
        if(scroller) {
            J(scroller)
                .children("[data-center]")
                .next()
                .not(".padding")
                .get(0)
                ?.scrollIntoView({block: "center", inline: "center", behavior: "smooth"})
        }
    }
    export function scrollPrev() {
        if(scroller) {
            J(scroller)
                .children("[data-center]")
                .prev()
                .not(".padding")
                .get(0)
                ?.scrollIntoView({block: "center", inline: "center", behavior: "smooth"})
        }
    }
    function carouselRoot(node: HTMLElement) {
        let scrollers = node.children
        if(scrollers.length > 1) throw new Error("Carousel must have only one scrollable element")
        else if(scrollers.length < 1) throw new Error("Carousel must have one scrollable element")
        scroller = scrollers[0] as HTMLElement
        if(!(scroller instanceof HTMLElement)) throw new Error("Carousel child must be an HTML Element")
        scrollCB(scroller, node)
        function scrollerScrollCB() {
            scrollCB(scroller as HTMLElement, node)
        }
        scroller.addEventListener("scroll", scrollerScrollCB)
        scroller.addEventListener("pointermove", scrollerScrollCB)
        return {
            destroy() {
                scroller.removeEventListener("scroll", scrollerScrollCB)
                scroller.removeEventListener("pointermove", scrollerScrollCB)
            }
        }
    }
</script>

<div 
    on:scroll={() => {

    }} 
    class='carousel'
    style:position="relative"
    style:overflow="hidden"
    style:width="100%"
    style:padding-block={padding}
    
>
    {#if !import.meta.env.SSR && controllButtons}
        <button 
            style:position="absolute"
            style:z-index="2"
            style:top="50%"
            style:left="1rem"
            style:transition="0 50%"
            on:click={scrollPrev}
        >{"<"}</button>
        <button
            style:position="absolute"
            style:z-index="2"
            style:top="50%"
            style:right="1rem"
            style:transition="0 50%"
            on:click={scrollNext}
        >{">"}</button>
    {/if}
    <div use:carouselRoot>
        <slot />
    </div>
    {#if !import.meta.env.SSR}
        <div 
            class='carousel-display'
            style:position="absolute"
            style:top={padding}
        >
            <slot />
        </div>
    {/if}
</div>
<style lang="sass">
    .carousel
        display: block
        @media (hover: none), (hover: on-demand), (-moz-touch-enabled: 1), (pointer:coarse)
            button
                display: none
</style>
