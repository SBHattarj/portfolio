<script lang="ts">
    import Animation from "$lib/core/components/Animation.svelte";
    import Keyboard from "$lib/core/components/Keyboard/Keyboard.svelte";
    import Logo from "$lib/core/components/Logo.svelte";
    import { info, say } from "$lib/core/stores/Info";
    import { MainStyles } from "$lib/core/stores/styles";
    import { sleep } from "$lib/core/utils/async";
    import { myName, portfolioQuote, bigNavButtonTransition, type AllTexts } from "./keyboardTexts";
    import createSectionObserver from "$lib/core/stores/section"
    import TopCodePanel from "./TopCodePanel.svelte";
    import SideCodePanel from "./SideCodePanel.svelte";
    import MyWorks from "./MyWorks.svelte";
	import { flip } from "svelte/animate";
    import { fly } from "svelte/transition";
    $: mainStyles = $MainStyles
    let showMyWork = false
    let introDone = false   
    let showMySkills = false
    let showAboutMe = false
    let showContact = false
    let bigButtonTransition = "100vw"
    let headerTransition = "translate(0, -100%)"
    let typed: string = ""
    let sectionObserver = createSectionObserver()
    $: typedLines = typed.split("\n")
    let typedQuote = ""
    let typedQuoteLines: string[] = []
    let textToType: AllTexts
    let isSidePanelShown = false
    let isTopPanelShown = false
    let topPanelDone = false
    let mainHeight = 0
    let sidePanelDone = false
    $: {
        if(textToType === portfolioQuote) {
            typedQuote = typed
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
         },
        async none() {
            await sleep(1000)
            sidePanelDone = true
            await sleep(1500)
            isTopPanelShown = true
        },
        async [bigNavButtonTransition]() {
            topPanelDone = true
            introDone = true
            await sleep(1500)
            showMyWork = true
            await sleep(700)
            showMySkills = true
            await sleep(700)
            showAboutMe = true
            await sleep(700)
            showContact = true
        },
    }
    
    $: {
        if(textToType === myName) typedName = typed
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
<header>
    <nav>
        {#each $sectionObserver.sections as section (section)}
            <a href={`#${section}`} animate:flip>{section.replace(/^.|[A-Z]/g, x => ` ${x.toUpperCase()}`)}</a>
        {/each}
    </nav>
</header>
<div
    id="page-container"
    style:position="absolute"
    style:inset="0"
    style:bottom={`${keyboardHeight}px`}
    style:transition="bottom 1s"
    style:overflow={introDone ? "auto" : "hidden"}
    bind:clientHeight={mainHeight}
    style:overflow-x="hidden"
>
    <section
        use:sectionObserver={"intro"}
    >
        <div class="quick-nav">
            <a class="big-nav-button" href="#my-work">My Work</a><a class="big-nav-button" href="#my-skills">My Skills</a>
        </div>
        <Logo
            left="calc(50vw - var(--width) / 2)"
            top="0"
            marginTop="3rem"
            width="max(min(60vw, 50vh, 100vh - 16em), 10rem)"
            animateOnEnter on:animation-end={async () => {
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
    </section>
    {#if showMyWork}
        <section in:fly={{y: 100}} use:sectionObserver={"myWorks"} >
            <MyWorks />
        </section>
    {/if}
    {#if showMySkills}
        <section use:sectionObserver={"mySkills"} >
        </section>
    {/if}
    {#if showAboutMe}
        <section use:sectionObserver={"aboutMe"} >
        </section>
    {/if}
    {#if showContact}
        <section use:sectionObserver={"contact"} >
        </section>
    {/if}
    <TopCodePanel bind:typed bind:textToType bind:isTopPanelShown bind:topPanelDone />
    <SideCodePanel bind:headerTransition bind:typed bind:textToType bind:isSidePanelShown bind:sidePanelDone bind:keyboardHeight />
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
    @use "sass:math"
    .quick-nav
        position: absolute
        top: 4rem
        left: 0
        right: 0
        .big-nav-button
            display: flex
            align-items: center
            justify-content: center
            color: #fff
            text-decoration: none
            width: min(15rem, calc(50vw - 2rem))
            position: absolute
            height: 3rem
            --width: max(min(60vw, 50vh, 100vh - 16em), 10rem)
            top: 2em
            height: calc( 4 / 5 * var(--width))
            --pos: calc(50vw)
            transition: transform 1s ease-in
            @for $i from 1 through 2
                &:nth-child(#{$i})
                    #{if($i == 1, left, right)}: var(--pos)
                    transform: translate(calc(#{(1.5 - $i) * 2} * var(--bigButtonTransition)))
    .dev-mode-button
        position: fixed
        bottom: 6em
        left: 50%
    header
       transition: transform 1s ease-in
       transform: var(--headerTransition)
    section
        &:global(#intro)
            padding-bottom: math.div(5rem, math.sqrt(2))
        &:global(#myWorks)
            background-color: var(--mainStyles-mainBackgroundColor-dark)
            min-height: 100em
            position: relative
            padding-top: math.div(5rem, math.sqrt(2)) + 0.5rem
            &::before
                content: ""
                display: block
                height: 5rem
                width: 5rem
                position: absolute
                top: 0
                left: 50%
                transform: translate(-50%, -50%) rotate(45deg)
                background-color: var(--mainStyles-mainBackgroundColor-highlight)
                box-shadow: inset 0.8em 0.8em var(--mainStyles-mainBackgroundColor-highlight), inset 1.6em 1.6em var(--mainStyles-mainBackgroundColor-dark), inset 2.4em 2.4em var(--mainStyles-mainBackgroundColor-highlight), inset 3.2em 3.2em var(--mainStyles-mainBackgroundColor-dark)
</style>
