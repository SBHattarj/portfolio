<script lang="ts">
    import toPXN from "to-px";
    import { getFunctionResult, getRandomCoefficients } from "$lib/core/utils/algebra";
	import { browser } from "$app/environment";
	import { fade } from "svelte/transition";
	import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher<{
        animationEnded: void
    }>()
    
    const toPX = (
        value: string | number, 
        element: HTMLElement
    ) => typeof value === "string" ? toPXN(value, element)! : value
    
    export let from: {
        x: number | string,
        y: number | string
    } = {x: 0, y: 0}
    export let to: {
        x: number | string,
        y: number | string
    }
    
    let position = {
        x: typeof to.x === "number" ? `${to.x}px` : to.x,
        y: typeof to.y === "number" ? `${to.y}px` : to.y
    }
    export let x = 0
    export let y = 0
    export let xTransition = 0
    export let yTransition = 0
    export let minX: number | string = "0vw"
    export let minY: number | string = "0vh"
    export let maxX: number | string = "100vw"
    export let maxY: number | string = "100vh"
    export let accuracy: number = 10
    export let duration: number = 1000
    let animationEnded = false
    function transition(dot: HTMLElement) {
        const xChange = toPX(from.x, dot) - toPX(to.x, dot)
        const yChange = toPX(from.y, dot) - toPX(to.y, dot)
        x = toPX(to.x, dot)
        y = toPX(to.y, dot)
        const xCoefficients = getRandomCoefficients(xChange, 4, 1 + accuracy / 100)
        const yCoefficients = getRandomCoefficients(yChange, 4, 1 + accuracy / 100)
        const maxXPx = toPX(maxX, dot)
        const minXPx = toPX(minX, dot)
        const maxYPx = toPX(maxY, dot)
        const minYPx = toPX(minY, dot)
        return {
            css(t: number, n: number) {
                xTransition = Math.max(
                    Math.min(getFunctionResult(xCoefficients, n, 1), maxXPx - toPX(to.x, dot)),
                    minXPx - toPX(to.x, dot)
                )
                yTransition = Math.max(
                    Math.min(getFunctionResult(yCoefficients, n, 1), maxYPx - toPX(to.y, dot)),
                    minYPx - toPX(to.y, dot)
                )
                return `translate: ${xTransition}px ${yTransition}px`
            },
            tick(t: number, n: number) {
                xTransition = Math.max(
                    Math.min(getFunctionResult(xCoefficients, n, 1), maxXPx - toPX(to.x, dot)),
                    minXPx - toPX(to.x, dot)
                )
                yTransition = Math.max(
                    Math.min(getFunctionResult(yCoefficients, n, 1), maxYPx - toPX(to.y, dot)),
                    minYPx - toPX(to.y, dot)
                )
                x = toPX(to.x, dot) + xTransition
                y = toPX(to.y, dot) + yTransition
                
            },
            duration
        }
    }
</script>
{#if !animationEnded}
    <div transition:fade|global={{duration: 300}}>
        <div class="dot" in:transition|global on:introend={() => {
            animationEnded = true
            dispatch("animationEnded")
        }}></div>
    </div>
{/if}

<style lang="sass">
    .dot
        position: fixed
        left: var(--position-x)
        top: var(--position-y)
        background-color: #fffa
        height: 1ch
        width: 1ch
        z-index: 999999
        border-radius: 2ch
</style>
