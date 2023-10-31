<script lang="ts">
	import { MainStyles } from '$lib/core/stores/styles';
	import { sleep } from "$lib/core/utils/async";
    import {fade} from "svelte/transition"
    import {keyboards, VirtualGrid, type KeyboardEntries, type KeyboardModes, type KeyboardTypes, type KeyboardTypeType} from "./Keyboard.layouts"
    import Animation from '../Animation.svelte';
	import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher<{
        "type-end": null
    }>()

    $: mainStyles = $MainStyles

    export let toBeTyped = ""
    export let typed = ""
    export let virtual = false
    export let errorRate = 30
    export let typingSpeed = 4
    export let percentTypingConsistency = 70
    export let noTyping = false
    export let allowEmpty = false
    export let clientHeight = 0

    $: clientHeight = virtual ? clientHeight : 0

    let isAnimating = false
    $: type = !isAnimating && !noTyping
    $: quarterErrorRate = errorRate / 4

    let currentKeyboard: KeyboardTypes
    $: currentKeyboard = virtual ? "Virtual" : "Physical"
    let currentMode: KeyboardModes = virtual ? "ABC" as const : "Normal" as const
    $: currentMode = virtual ? "ABC" as const : "Normal" as const
    let virtualKeyTyped = ''
    let dotX = 0
    let dotY = 0

    function findPosOfKey(key: string) {
        for(const [mode, layout] of ([[currentMode, keyboards[currentKeyboard][currentMode]], ...Object.entries(keyboards[currentKeyboard])] as KeyboardEntries)) {
            let xIndex = -1
            const yIndex = layout.findIndex(column => {
                xIndex = column.findIndex(layoutKey => layoutKey === key)
                return xIndex > -1
            })
            if(yIndex > -1) {
                return {
                    mode,
                    xIndex,
                    yIndex
                }
            }
        }
    }

    function getPosPercent(possibility: number, quarterErrorPercent: number = quarterErrorRate) {
        return Math.abs(
            ((possibility - quarterErrorPercent) % (possibility - 2 * quarterErrorPercent))
            * 100 / (possibility - 2 * quarterErrorPercent)
        )
    }
    function getIndexFromPossibility(
        startIndex: number,
        endIndex: number,
        possibility: number,
        arrayLength: number,
        quarterErrorPercent: number = quarterErrorRate,
    ) {
        if(possibility < quarterErrorPercent) return startIndex < 1 ? 1 : startIndex - 1
        if((possibility + quarterErrorPercent) > 100)
            return endIndex >= (arrayLength - 1) ? arrayLength - 1 : endIndex
        return startIndex
    }

    function getPosKeyToType(key: string): {
        mode: KeyboardModes,
        xIndex: number,
        yIndex: number
    } {
        const {mode = currentMode, xIndex = -1, yIndex = -1} = findPosOfKey(key) ?? {}
        if(mode !== currentMode) {
            return getPosKeyToType(mode)
        }
        return {mode, xIndex, yIndex}
    }

    function getRealPosKeyToType(key: string) {
        const {mode, xIndex, yIndex} = getPosKeyToType(key)
        const keyRow = (keyboards[currentKeyboard] as KeyboardTypeType)[mode][yIndex]
        const keyToBeTypedNext = keyRow[xIndex]
        const keyXStart = xIndex
        const keyXEnd = keyRow
            .slice(keyXStart)
            .findIndex((_, index, row) => row[index + 1] !== keyToBeTypedNext)
        const keyY = yIndex
        const xPossibility = Math.random() * 100
        const yPossibility = Math.random() * 100
        const truePosX = getIndexFromPossibility(
            keyXStart,
            keyXEnd,
            xPossibility,
            keyRow.length
        )
        const truePosY = getIndexFromPossibility(
            keyY,
            keyY,
            yPossibility,
            (keyboards[currentKeyboard] as KeyboardTypeType)[mode].length
        )
        const percentPosX = getPosPercent(xPossibility)
        const percentPosY = getPosPercent(yPossibility)
        return {
            mode,
            xIndex: truePosX,
            yIndex: truePosY,
            xPos: percentPosX,
            yPos: percentPosY
        }
    }
    async function typer(toBeTypedInner: string, typeInner: boolean)  {
        while(type && typed !== toBeTypedInner && toBeTypedInner === toBeTyped) {
            await sleep(1000 / typingSpeed * (1 - Math.random() * percentTypingConsistency / 100))
            if(toBeTyped === '' && !allowEmpty) {
                continue
            }
            if(!type) continue
            if(virtualKeyTyped in keyboards[currentKeyboard]) {
                currentMode = virtualKeyTyped as KeyboardModes
                virtualKeyTyped = ""
                continue
            }
            if(virtualKeyTyped !== "Backspace" && virtualKeyTyped !== ''){
                typed = typed + (virtualKeyTyped === "Enter" ? "\n" : virtualKeyTyped)
            }
            if(virtualKeyTyped === "Backspace")
                typed = typed.substring(0, typed.length - 1)

            const indexToBeTyped = toBeTyped.split('').findIndex((letter, index) => letter !== typed[index])
            const currentLetterToBeTyped = toBeTyped[indexToBeTyped] ?? ''
            const letterToBeTyped =
                typed !== toBeTyped.substring(0, typed.length)
                ? "Backspace"
                : currentLetterToBeTyped
            if(letterToBeTyped === '') continue
            const {
                mode,
                xIndex,
                yIndex,
                xPos,
                yPos
            } = getRealPosKeyToType(letterToBeTyped)
            const newKey =  keyboards
                ?.[currentKeyboard]
                ?.[mode]
                ?.[yIndex]
                ?.[xIndex]
                ?? ""
            virtualKeyTyped = newKey
            dotX = xPos
            dotY = yPos
        }
        if(typed === toBeTyped) {
            if(virtualKeyTyped !== '') dispatch("type-end")
            virtualKeyTyped = ''
        }
    }
    $: {
        typer(toBeTyped, type)
    }
    function createGridLayout(virtualGrid: typeof VirtualGrid, currentMode: string) {
        if(currentMode in virtualGrid) {
            const rows = virtualGrid[currentMode as keyof typeof VirtualGrid]
            const layout = rows.reduce((layout, row) => {
                const rowLayout = row.reduce(
                    (rowLayout, cell) => `${rowLayout} ${cell}`
                )
                if(layout === '') return `"${rowLayout}"`
                return `${layout} "${rowLayout}"`
            }, '')
            const layoutColumnWidths = rows[0].reduce(value => `${value} 1fr`, '')
            return `${layout} / ${layoutColumnWidths}`
        }
        return ''
    }
    $: (async () => {
        if(!virtual) {
            await sleep(1000)
            isAnimating = false
        }
    })()
</script>
{#if virtual}
    <Animation frames={[
        {
            css: {
                transform: "translateY(100%)",
            },
            duration: 500
        },
        {
            css: {
                transform: "none",
                transition: "transform 1s",
            },
            duration: 500
        }
    ]} let:transition>

        <div
            transition:transition|global
            on:transitionstart={() => {
                isAnimating = true
            }}
            on:transitionend={() => {
                isAnimating = false
            }}
            style:grid-template={createGridLayout(VirtualGrid, currentMode)}
            class="keyboard"
            bind:clientHeight={clientHeight}
        >
            {#each keyboards[currentKeyboard][currentMode] as row, rowIndex}
                {#each row as cell, cellIndex}
                    <div
                        style:grid-area={VirtualGrid[currentMode][rowIndex][cellIndex]}
                        class="keyboard-cell"
                    >
                        {#if cell.startsWith("ABC")}
                            <p>⇬</p>
                        {:else if cell === "Backspace"}
                            <p>⌫</p>
                        {:else if cell === "\n"}
                            <p>⏎</p>
                        {:else}
                            <p>{cell}</p>
                        {/if}
                        {#if virtualKeyTyped === cell}
                            {#key typed}
                            <div
                                class="highlight-background"
                                transition:fade|global={{duration: 700}}
                            ></div>
                                <div
                                    class="dot"
                                    style:top={`${dotX}%`}
                                    style:left={`${dotY}%`}
                                    transition:fade|global={{duration: 700}}
                                ></div>
                            {/key}
                        {/if}
                    </div>
                {/each}
            {/each}
        </div>
    </Animation>
{/if}
<style lang="sass">
    .keyboard
        display: grid
        position: fixed
        left: 0
        right: 0
        bottom: 0
        gap: 0.5rem
        padding: 0.5rem
        background-color: var(--mainStyles-mainBackgroundColor-dark)
        border-radius: 0.5rem 0.5rem 0 0
    .keyboard-cell
        background-color: var(--mainStyles-mainBackgroundColor-light)
        padding-block: min(0.7em, 1%)
        margin: 0
        text-align: center
        border-radius: 0.4em
        position: relative

    .dot
        width: 1ch
        height: 1ch
        background-color: #fff
        position: absolute
        border-radius: 1ch
    .highlight-background
        position: absolute
        top: 0
        left: 0
        right: 0
        bottom: 0
        background-color: #fff4
</style>
