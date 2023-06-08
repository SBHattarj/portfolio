<script lang="ts">
    import Animation from "$lib/core/components/Animation.svelte";
    import Keyboard from "$lib/core/components/Keyboard/Keyboard.svelte";
    import Logo from "$lib/core/components/Logo.svelte";
    import TouchDot from "$lib/core/components/TouchDot.svelte";
    import { info, say } from "$lib/core/stores/Info";
    import { MainStyles } from "$lib/core/stores/styles";
    import { sleep } from "$lib/core/utils/async";
    import { myName, portfolioQuote, bigNavButtonTransition, type AllTexts } from "./keyboardTexts";
    import {codeBlock} from "$lib/core/utils/codeTag";
    import Code from "$lib/core/components/Code.svelte";
    import typescript from "svelte-highlight/languages/typescript";
    import toPX from "to-px";
	import { debug } from "svelte/internal";
    $: mainStyles = $MainStyles
    let headerTransition = "translateY(100vh)"
    let bigButtonTransition = "100vw"
    let a: string = ""
    let typed: string = ""
    let dot = false
    $: typedLines = typed.split("\n")
    let typedQuote = ""
    let typedQuoteLines: string[] = []
    let textToType: AllTexts
    let dotTransitionX = 0
    let dotTransitionY = 0
    let isSidePanelShown = false
    let isTopPanelShown = false
    let rightSideCodePanel: HTMLDivElement | undefined
    let topPanelHeight = 0
    let topPanelDone = false
    let topPanelDoneY = 0
    $: if(topPanelDone) dotTransitionY = topPanelDoneY
    let panelX = 0
    let mainHeight = 0
    let codeText = "let world = hello"
    let sideCodePre: HTMLPreElement
    let sidePanelDone = false
    let doneX = 0
    $: if(sidePanelDone && sideCodePre) dotTransitionX = sideCodePre.clientWidth + doneX + 2 * toPX(mainStyles.spacing.normal, document.body)!
    $: if(rightSideCodePanel) {
        panelX = rightSideCodePanel.getBoundingClientRect().x
    }

    $: {
        if(textToType === portfolioQuote) {
            typedQuote = typed
        }
        if(textToType === "none") {
            headerTransition = typed
        }
    }
    $: {
        if(textToType === portfolioQuote) {
            typedQuoteLines = typedLines
        }
    }
    let devModeButtonVisible = false
    let isTyping = false
    let isVirtual = false
    let keyboardHeight = 0
    let isDevMode = false
    let scrollContainer = "#page-container"
    let typedName = ""
    let errorRate = 30
    let typingSpeed = 4
    let percentTypingConsistency = 60
    const typeEndCallbacks = {
        [portfolioQuote]() {
            textToType = myName
            typed = ""
        },
        async [myName]() {
            isSidePanelShown = true
            await sleep(1000)
            J(sideCodePre).scrollTo(".hljs-line-73", 500)
            await sleep(1400)
            await say("what the?", 1600)
            await say("really?", 1400)
            typed = headerTransition
            textToType = "none"
        },
        async none() {
            await sleep(1000)
            sidePanelDone = true
        },
        async [bigNavButtonTransition]() {
            topPanelDone = true
        }
    }
    
    $: {
        if(textToType === myName) typedName = typed
        if(textToType === "none") headerTransition = typed
        if(textToType === bigNavButtonTransition) bigButtonTransition = typed
    }
    $: {
        if(isDevMode) info("DevMode: on", 1000)
    }    
    $: {
        if(typedLines.at(-1)?.length === 1) {
            setTimeout(() => {
                J(scrollContainer).scrollTo("p[data-to-focus=true]", {
                    axis: 'y',
                    duration: 500
                })
            })
        }
    }
</script>
<header></header>
<div
    id="page-container"
    style:position="absolute"
    style:inset="0"
    style:bottom={`${keyboardHeight}px`}
    style:transition="bottom 1s"
    style:overflow="hidden"
    bind:clientHeight={mainHeight}
>
    <div class="quick-nav">
        <a class="big-nav-button" href="#my-work">My Work</a><a class="big-nav-button" href="#my-skills">My Skills</a>
    </div>
    <Logo
        left="calc(50vw - var(--width) / 2)"
        top="0"
        marginTop="3rem"
        width="min(60vw, 50vh, 100vh - 16em)"
        animateOnEnter on:animation-end={async () => {
            dot = true
            await sleep(400)
            await say("hmm...", 1000)
            await say("uhh... hmm", 1300)
            await sleep(300)
            await say("huh... huh?", 1600)
            await say("did I really!?", 2000)
            await say("ahh...", 700)
            devModeButtonVisible = true
            await say("user can you please hit this button?")
            while(true) {
                await sleep(2000)
                if(!devModeButtonVisible) break
                await say("hello?", 3000)
                await sleep(1500)
                if(!devModeButtonVisible) break
                await say("anyone over there?", 4000)
                await sleep(1000)
                if(!devModeButtonVisible) break
                await say("please can you just click the button?", 4500)
                await sleep(2300)
                if(!devModeButtonVisible) break
                await say("are you just gonna stare at the screen?", 4500)
                await sleep(4000)
                if(!devModeButtonVisible) break
                await say("You know", 2000)
                if(!devModeButtonVisible) break
                await say("you can always click the button")
                await sleep(3000)
                if(!devModeButtonVisible) break
                await say("Please just click the button", 2500)
                await say("it's ^ here")
            }
            await say("Thank you!", 1500)
            await say("now, give me a few minutes", 2000)
            await sleep(1000)
            isTyping = true
            isVirtual = true
            await sleep(1000)
            textToType = portfolioQuote
            await sleep(15000 + Math.random() * 30000)
            await say("This is taking too long", 4000)
            isVirtual = false
            errorRate = 20
            typingSpeed = 8
            percentTypingConsistency = 70
            await info("OTG: on", 1000)
            await say("thats better!", 3000)
        }}
    />
    <div
        style:position="relative"
        style:left="50%"
        style:width="fit-content"
    >
        {#each typedQuoteLines as line, index}
            <p style:width="fit-content" data-to-focus={index === (typedQuoteLines.length - 1) && textToType === portfolioQuote}>{line}</p>
        {/each}
        <p
            style:width="max-content"
            style:margin-left="60%"
            data-to-focus={textToType === myName}
        >{typedName}</p>
    </div>
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
                bind:yTransition={dotTransitionY}
                on:animationEnded={async () => {
                    
                }}
            />
        {/if}
        <div style:transform="translateY({dotTransitionY}px)" bind:clientHeight={topPanelHeight} class="top-code-panel">
            <pre id="top-code-pre" use:codeBlock={{lang: "css"}} class="hljs" bind:this={sideCodePre}>
                <code class={a}>
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
                on:animationEnded={() => {
                    codeText = "let this = 'works'"
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
        >
            <pre use:codeBlock={{}} class="hljs" bind:this={sideCodePre}>
                <code class={a}>
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
</div>

<Keyboard
    bind:typed
    toBeTyped={textToType}
    virtual={isVirtual}
    {errorRate}
    {typingSpeed}
    {percentTypingConsistency}
    bind:clientHeight={keyboardHeight}
    on:type-end={typeEndCallbacks[textToType]}
/>


{#if devModeButtonVisible}
    <Animation
        frames={[
            {
                css: {
                    translate: "-50% 50vh",
                    transition: `translate 300ms, outline-width 0.2s`
                },
                duration: 300
            },
            {
                css: {
                    translate: "-50% 0",
                    transition: `translate 300ms, outline-width 0.2s`
                },
                duration: 300
            }
        ]}
        let:transition
    >
        <button class="dev-mode-button" transition:transition on:click={() => {
            devModeButtonVisible = false
            isDevMode = true
        }} >Dev Mode</button>
    </Animation>
{/if}

<style lang="sass">
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
            &:nth-child(1)
                left: var(--pos)
                transform: translate(calc(-1 * var(--bigButtonTransition)))
            &:nth-child(2)
                right: var(--pos)
                transform: translate(calc(1 * var(--bigButtonTransition)))
            &:hover, &:focus-visible
                outline-width: 0.4rem
    .dev-mode-button
        position: fixed
        bottom: 6em
        left: 50%
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
            &:not(:last-child)
                border-right: 0.1em solid
            @for $i from 1 through 3
                &:nth-child(3n+#{$i})
                    color: var(--mainStyles-indentBorderColors-_#{($i - 1)})
                    background-color: var(--mainStyles-indentBackgroundColors-_#{($i - 1)})
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
        transform: var(--headerTransition)
</style>
