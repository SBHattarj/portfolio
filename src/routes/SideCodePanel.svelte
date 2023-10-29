<script lang="ts">
    import J from "jquery"
    import TouchDot from "$lib/core/components/TouchDot.svelte";
    import { sleep } from "$lib/core/utils/async";
    import { say } from "$lib/core/stores/Info";
    import { codeBlock } from "$lib/core/utils/codeTag";
    import toPX from "to-px";
    import { MainStyles } from "$lib/core/stores/styles";
    $: mainStyles = $MainStyles
    export let isSidePanelShown = false
    export let sidePanelDone = false
    export let keyboardHeight = 0
    export let headerTransition = "translate(0, 100vw)"
    export let typed = ""
    export let textToType = ""
    $: if(textToType === "none") headerTransition = typed
    let panelX = 0
    let mainHeight = 0
    let dotTransitionX = 0
    let doneX = 0
    let isTopPanelShown = false
    let sideCodePre: HTMLPreElement
    let rightSideCodePanel: HTMLDivElement

    $: if(sidePanelDone && sideCodePre) dotTransitionX = sideCodePre.clientWidth + doneX + 2 * toPX(mainStyles.spacing.normal, document.body)!
    $: if(rightSideCodePanel) {
        panelX = rightSideCodePanel.getBoundingClientRect().x
    }
</script>
{#if isSidePanelShown}
    {#if panelX !== 0}
        <TouchDot 
            to={{
                x: panelX,
                y: mainHeight * .6
            }}
            from={{
                x: "100vw",
                y: mainHeight * .7
            }}
            bind:xTransition={dotTransitionX}
            on:animationEnded={async () => {
                J(sideCodePre).scrollTo(".hljs-line-73", 500)
                await sleep(1400)
                await say("what the?", 1600)
                await say("really?", 1400)
                typed = headerTransition
                textToType = "none"
            }}
        />
    {/if}
    {#if sidePanelDone}
        <TouchDot
            to={{
                x: "100vw",
                y: mainHeight * .65
            }}
            from={{
                x: panelX,
                y: mainHeight * .83
            }}
            bind:xTransition={doneX}
            on:animationEnded={async () => {
                isSidePanelShown = false
                await sleep(1000)
                isTopPanelShown = true
            }}
        />
    {/if}
    <div
        class="right-side-code-panel"
        bind:this={rightSideCodePanel}
        style:transform={`translate(${dotTransitionX}px)`}
        style:bottom={`${keyboardHeight}px`}
        on:introend={async () => {
        }}
    >
        <pre use:codeBlock={{}} class="hljs" bind:this={sideCodePre}>
            <code>
                    .dev-mode-button
                        position: fixed
                        bottom: 6em
                        left: 50%
                    .right-side-code-panel
                        position: fixed
                        top: 0
                        right: 0
                        bottom: 0
                        width: min(80vw, 40ch)
                        background-color: var(--mainStyles-mainBackgroundColor-light)
                        border-top-left-radius: var(--mainStyles-borderRadius-big)
                        border-bottom-left-radius: var(--mainStyles-borderRadius-big)
                        z-index: 5
                        box-shadow: -1ch 0ch 1.5ch black
                        display: grid
                        padding: var(--mainStyles-spacing-normal)
                    pre.hljs
                        background-color: var(--mainStyles-mainBackgroundColor-dark)
                        padding: var(--mainStyles-spacing-normal)
                        border-radius: var(--mainStyles-borderRadius-normal)
                        margin: 0
                        overflow: hidden
                        .hljs-code-block
                            min-width: 0px
                            overflow: hidden
                        .hljs-code-line
                            min-width: 0px
                            overflow: hidden
                            display: flex
                            white-space: pre-wrap
                            flex-direction: row
                        .hljs-whitespace
                            &:not(:nth-last-child(-n+2))
                                border-right: 0.1em solid
                            @for $i from 1 through 3
                                &:nth-child(3n+{"#{$i}"})
                                    color: var(--mainStyles-indentBorderColors-_{"#{($i - 1)}"})
                                    background-color: var(--mainStyles-indentBackgroundColors-_{"#{($i - 1)}"})
                        .hljs-line-id
                            padding-right: var(--mainStyles-spacing-small)
                            margin-right: var(--mainStyles-spacing-normal)
                            border-right: 1px solid var(--mainStyles-fadedColor-light)
                            height: 100%
                            display: block
                            color: var(--mainStyles-fadedColor-highlight)
                            text-align: right
                        .hljs-comment
                            color: var(--mainStyles-fadedColor-light)
                        .hljs-quote, .hljs-string, .hljs-symbol, .hljs-bullet, .hljs-addition
                            color: var(--mainStyles-fontColor-highlight)
                        .hljs-variable, .hljs-template-variable, .hljs-tag, .hljs-name, .hljs-selector-id, .hljs-selector-class, .hljs-regexp, .hljs-deletion, .hljs-keyword, .hljs-selector-tag, .hljs-attribute, .hljs-title, .hljs-section
                            color: var(--mainStyles-fontHighlightColors-_0)
                        .hljs-keyword, .hljs-selector-tag, .hljs-attribute
                            font-style: italic
                        .hljs-title, .hljs-section
                            font-weight: bold
                        .hljs-number, .hljs-built_in, .hljs-literal, .hljs-type, .hljs-params, .hljs-meta, .hljs-link
                            color: var(--mainStyles-fontHighlightColors-_1)
                        .hljs-emphasis
                            font-style: italic
                        .hljs-strong
                            font-weight: bold
                    header
                        position: fixed
                        top: 0
                        left: 0
                        right: 0
                        z-index: 4
                        height: 2rem
                        background-color: var(--mainStyles-mainBackgroundColor-light)
                        box-shadow: 0px 1ch 1.5ch black
                        transform: {headerTransition}
            </code>
        </pre>
    </div>
{/if}

<style lang="sass">
    .right-side-code-panel
        position: fixed
        top: 0
        right: 0
        bottom: 0
        width: min(80vw, 40ch)
        background-color: var(--mainStyles-mainBackgroundColor-light)
        border-top-left-radius: var(--mainStyles-borderRadius-big)
        border-bottom-left-radius: var(--mainStyles-borderRadius-big)
        z-index: 5
        box-shadow: -1ch 0ch 1.5ch black
        display: grid
        padding: var(--mainStyles-spacing-normal)
</style>
