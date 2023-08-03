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
	import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher<{
        "scroll-animate": ScrollAnimateDetail,
        "scroll-center": ScrollCenterDetail
    }>()
    export let centerCheck: CenterCheck = function (distanceFromCenter, fullWidth, fullHeight) {

        const scalingX = ((fullWidth / distanceFromCenter.x) ** 2) / 20
        const scalingY = ((fullHeight / distanceFromCenter.y) ** 2) / 20
        return scalingX > 1 && scalingY > 1
    }
    
    function scrollCB(node: HTMLElement, carouselRoot: HTMLElement) {
        const target = J(node)
        const carouselDisplay = J(carouselRoot).next(".carousel-display")

        const children = target.children()
        children
            .css("opacity", "0")
            .css("pointer-events", "none")
            .attr("tabindex", "-1")
            .find("*")
            .attr("tabindex", "-1")
        children.each(function (index, childDom) {
            const child = J(this)
            let displayedChild = carouselDisplay.children().children(`[data-carousel-display-index="${index}"]`)
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
                displayedChild.on("wheel", () => {
                    displayedChild.css("pointer-events", "none").find("*").css("pointer-events", "none")
                        .attr("data-pointer-events", "none")
                    clearTimeout(scroll)
                    scroll = setTimeout(() => {
                        displayedChild.css("pointer-events", "all").find("*").css("pointer-events", "all")
                            .attr("data-pointer-events", "all")
                    }, 250)
                })
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
                        offset.left
                    }px ${
                        offset.top
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
                x: offset.left - parentDimensions.width / 2 + childDimensions.width / 2,
                y: offset.top - parentDimensions.height / 2 + childDimensions.height / 2,
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
                return 
            }
            
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
    function carouselRoot(node: HTMLElement) {
        let scrollers = node.children
        console.log(scrollers)
        if(scrollers.length > 1) throw new Error("Carousel must have only one scrollable element")
        else if(scrollers.length < 1) throw new Error("Carousel must have one scrollable element")
        const scroller = scrollers[0]
        if(!(scroller instanceof HTMLElement)) throw new Error("Carousel child must be an HTML Element")
        scrollCB(scroller, node)
        function scrollerScrollCB() {
            scrollCB(scroller as HTMLElement, node)
        }
        scroller.addEventListener("scroll", scrollerScrollCB)
        return {
            destroy() {
                scroller.removeEventListener("scroll", scrollerScrollCB)
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
    
>
    <div use:carouselRoot>
        <slot />
    </div>
    <div 
        class='carousel-display'
        style:position="absolute"
        style:top="0"
    >
        <slot />
    </div>
</div>
