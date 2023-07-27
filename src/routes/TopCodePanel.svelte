<script lang="ts">
	import { sleep } from "$lib/core/utils/async";
    import { say } from "$lib/core/stores/Info";
    import TouchDot from "$lib/core/components/TouchDot.svelte";
    import { bigNavButtonTransition } from "./keyboardTexts";
    import { codeBlock } from "$lib/core/utils/codeTag";
    import { MainStyles } from "$lib/core/stores/styles";
    $: mainStyles = $MainStyles
    export let typed = "";
    export let textToType = "";
    export let isTopPanelShown = false;
    let bigButtonTransition = "100vw"
    $: if(textToType === bigNavButtonTransition) bigButtonTransition = typed

    let topPanelHeight = 0
    let dotTransitionY = 0
    export let topPanelDone = false
    let topPanelDoneY = 0
    $: if(topPanelDone) dotTransitionY = topPanelDoneY - topPanelHeight
</script>
{#if isTopPanelShown}
    {#if topPanelHeight !== 0}
        <TouchDot
            to={{
                x: "70vw",
                y: topPanelHeight
            }}
            from={{
                x: "80vw",
                y: 0
            }}
            bind:yTransition={dotTransitionY}
            on:animationEnded={async () => {
                await sleep(1000)
                J("#top-code-pre").scrollTo(".hljs-line-44", 500)
                await sleep(700)
                await say("huh...", 1400)
                typed = bigButtonTransition
                textToType = bigNavButtonTransition
            }}
        />
    {/if}
    {#if topPanelDone}
        <TouchDot
            to={{
                x: "70vw",
                y: 0
            }}
            from={{
                x: "80vw",
                y: topPanelHeight
            }}
            bind:yTransition={topPanelDoneY}
            on:animationEnded={async () => {
                isTopPanelShown = false
            }}
        />
    {/if}
    <div style:transform="translateY({dotTransitionY}px)" bind:clientHeight={topPanelHeight} class="top-code-panel">
        <pre id="top-code-pre" use:codeBlock={{}} class="hljs">
            <code>
                body
                    background-color: var(--mainStyles-mainBackgroundColor-accent)
                    color: var(--mainStyles-fontColor-main)
                body, html
                    min-height: 100%
                input, button, textarea
                    --border-color: var(--mainStyles-mainBackgroundColor-highlight)
                    color: inherit
                    font-size: inherit
                    background-color: var(--mainStyles-mainBackgroundColor-light)
                    outline: 0.2em solid var(--mainStyles-mainBackgroundColor-highlight)
                    padding-inline: 1em
                    padding-block: 0.5em
                    border-radius: 1em
                    border: none
                    outline-width: 0.2em
                    transition: outline-width 0.2s
                    &:focus-visible, &:hover
                        outline-width: 0.4em
                    &:active
                        background-color: var(--mainStyles-mainBackgroundColor-dark)
                .quick-nav
                    position: absolute
                    top: 4rem
                    left: 0
                    right: 0
                    .big-nav-button
                        display: flex
                        align-items: center
                        justify-content: center
                        vertical-align: middle
                        color: #fff
                        text-decoration: none
                        transition: outline-width 0.2s
                        width: min(15rem, calc(50vw - 2rem))
                        height: 3rem
                        background-color: var(--mainStyles-mainBackgroundColor-light)
                        border-radius: var(--mainStyles-borderRadius-normal)
                        text-align: center
                        outline: 0.2rem solid var(--mainStyles-mainBackgroundColor-highlight)
                        position: absolute
                        --width: min(60vw, 50vh, 100vh - 16em)
                        top: 0
                        --pos: calc(50vw)
                        --bigButtonTransition: {bigButtonTransition}
                        &:nth-child(1)
                            left: var(--pos)
                            transform: translate(calc(-1 * var(--bigButtonTransition)))
                        &:nth-child(2)
                            right: var(--pos)
                            transform: translate(calc(1 * var(--bigButtonTransition)))
                        &:hover, &:focus-visible
                            outline-width: 0.4rem
            </code>
        </pre>
    </div>
{/if}
<style lang="sass">
    .top-code-panel
        position: fixed
        top: 0
        left: 0
        right: 0
        z-index: 6
        height: min(45vh, 20rem)
        background-color: var(--mainStyles-mainBackgroundColor-light)
        border-bottom-left-radius: var(--mainStyles-borderRadius-big)
        border-bottom-right-radius: var(--mainStyles-borderRadius-big)
        box-shadow: 0ch 1ch 1.5ch black
        display: grid
        padding: var(--mainStyles-spacing-normal)
</style>
