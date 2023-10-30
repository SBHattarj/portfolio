<script lang="ts">
    import MySkills from "./MySkills.svelte";
    import { addPlacement } from "$lib/core/utils/number"
    import Animation from "$lib/core/components/Animation.svelte";
    import Keyboard from "$lib/core/components/Keyboard/Keyboard.svelte";
    import Logo from "$lib/core/components/Logo.svelte";
    import { info, say } from "$lib/core/stores/Info";
    import { MainStyles } from "$lib/core/stores/styles";
    import { sleep } from "$lib/core/utils/async";
    import { myName, portfolioQuote, bigNavButtonTransition, aboutMe, type AllTexts } from "./keyboardTexts";
    import createSectionObserver from "$lib/core/stores/section"
    import TopCodePanel from "./TopCodePanel.svelte";
    import SideCodePanel from "./SideCodePanel.svelte";
    import MyWorks from "./MyWorks.svelte";
	import { flip } from "svelte/animate";
    import gmailSvg from "./gmail.svg?raw"
    import phoneSvg from "../phone.svg?raw"
    import linkedinSvg from "../linkedin.svg?raw"
    import githubSvg from "../github.svg?raw"
    import { svgExtend } from "$lib/core/utils/svg";
    import { fade, fly } from "svelte/transition";
    import J from "jquery";
	import node from "full-client-server-sveltekit";
    import { page } from "$app/stores";
	import { getVisitorNumber, IntroComplete } from "server:/lib/core/server/visitor";
    console.log(phoneSvg)

    export let data;

    $: projects = data.projects
    $: skills = data.skills

    $: mainStyles = $MainStyles
    let showMyWork = false
    let introDone = false   
    let showMySkills = false
    let showAboutMe = false
    let showContact = false
    let bigButtonTransition = import.meta.env.SSR || $page.data.introComplete ? bigNavButtonTransition : "100vw"
    let headerTransition = import.meta.env.SSR || $page.data.introComplete ? "none" : "translate(0, -100%)"
    let typed: string = ""
    let sectionObserver = createSectionObserver({threshold: 0.2})
    $: typedLines = typed.split("\n")
    let typedQuote = import.meta.env.SSR || $page.data.introComplete ? portfolioQuote : ""
    let typedQuoteLines: string[] = typedQuote.split("\n")
    let textToType: AllTexts
    let isSidePanelShown = false
    let isTopPanelShown = false
    let topPanelDone = false
    let mainHeight = 0
    let sidePanelDone = false
    let typedAboutMe = import.meta.env.SSR || $page.data.introComplete ? aboutMe : ""
    let visitorNumber: number | null | undefined = data.visitorNumber ?? null;
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
    $: if(textToType === aboutMe) {
        typedAboutMe = typed
    }
    $: if($sectionObserver.visibleSections.has("aboutMe")) {
        if(textToType !== aboutMe) {
            typed = ""
            textToType = aboutMe
        }
    }
    $: if(textToType === aboutMe) {
        isTyping = $sectionObserver.visibleSections.has("aboutMe")
    }
    let devModeButtonVisible = false
    let isTyping = false
    let isVirtual = false
    let keyboardHeight = 0
    let isDevMode = false
    let scrollContainer = "#page-container"
    let typedName = import.meta.env.SSR || $page.data.introComplete ? myName : ""
    let errorRate = 30
    let typingSpeed = $page.data.IntroComplete ? 8 : 4
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
            visitorNumber = await node(async () => {
                const id = $page.data.userId
                IntroComplete(id);
                return await getVisitorNumber(id)
            })
            showMyWork = true
            await sleep(700)
            showMySkills = true
            await sleep(700)
            showAboutMe = true
            await sleep(700)
            showContact = true
            await say("ahh, atlast it seems to be working now", 5000)
            await say("Welp, thanks for the wait!", 3000)
            await say("Now, everything should work just fine", 2600)
            await say("Hope you like it", 1400)
            await info("DevMode: off", 1000)
            isDevMode = false
        },
        [aboutMe]() {}
    }
    let visitorNumberString = data.visitorNumber?.toString() ?? ""
    async function setVisitorNumberString(visitorNumberCurr: number) {
        const vns = visitorNumberCurr.toString()
        while(visitorNumberString !== vns && visitorNumberCurr === visitorNumber) {
            if(vns.startsWith(visitorNumberString)) {
                console.log(vns)
                visitorNumberString += Math.round(Math.random() * 10).toString()
                await sleep(100)
                continue
            }
            visitorNumberString = `${
                visitorNumberString.substring(0, visitorNumberString.length - 1)
            }${Math.round(Math.random() * 10).toString()}`
            await sleep(100)
        }
    }
    $: {
        if(visitorNumber != null) {
            setVisitorNumberString(visitorNumber)

        }
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
        {#if !isDevMode || import.meta.env.SSR || $page.data.introComplete}
            
            <div class="mobile-nav-open-button" tabindex="-1">
            </div>
        {/if}
        <ul tabIndex="-1">
            {#each $sectionObserver.sections as section (section)}
                <li animate:flip>
                    <a
                        href={`#${section}`} 
                        class:active={$sectionObserver.visibleSections.has(section)}
                    >{section.replace(/^.|[A-Z]/g, x => ` ${x.toUpperCase()}`)}</a>
                </li>
            {/each}
            {#if import.meta.env.SSR }
                {#each ["intro", "myWorks", "mySkills", "aboutMe", "contacts"] as section (section)}
                    <li>
                        <a href="#{section}">{section.replace(/^.|[A-Z]/g, x => ` ${x.toUpperCase()}`)}</a>
                    </li>
                {/each}
            {/if}
        </ul>
        {#if !isDevMode || import.meta.env.SSR || $page.data.introComplete}
            <div class="mobile-nav-close-button">
                <svg viewBox="-10 -10 120 120">
                    <path
                        d="
                            M 15,50
                            H 150
                            V 0
                            H 10
                            C 10,0 0,0 0,10
                            C 0,12 0,13 10,20
                            L 90,80
                            C 94.8,83.6 100,88 100,90
                            C 100,90 100,100 90,100
                            H 10
                            C 10,100, 0,100 0,90
                            C 0,87 5.2,83.6 10,80
                            L 100,2.5
                        "
                        stroke={mainStyles.fontColor.highlight}
                        stroke-width="20"
                        stroke-linecap="round"
                        fill="none"
                        stroke-dasharray="
                            80 160
                            90 150
                            85 151
                        "
                    >
                </svg>
            </div>
        {/if}
    </nav>
</header>
<div
    id="page-container"
    style:position="absolute"
    style:inset="0"
    style:bottom={`${keyboardHeight}px`}
    style:transition="bottom 1s"
    style:overflow={(introDone || import.meta.env.SSR || $page.data.introComplete) ? "auto" : "hidden"}
    bind:clientHeight={mainHeight}
    style:overflow-x="hidden"
>
    {#if true}
        <section
            id="intro"
            use:sectionObserver={"intro"}
        >
            <Logo
                left="calc(50vw - var(--width) / 2)"
                top="0"
                marginTop="4rem"
                width="min(max(min(60vw, 50vh, 100vh - 16em), 10rem), 100ch)"
                animateOnEnter={!$page.data.introComplete} on:animation-end={async () => {
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
                class="typed-quote"
            >
                {#each typedQuoteLines as line, index}
                    <p style:width="fit-content" data-to-focus={index === (typedQuoteLines.length - 1) && textToType === portfolioQuote}>{line}</p>
                {/each}
                <p
                    data-to-focus={textToType === myName}
                    class="typed-name"
                >{typedName}</p>
            </div>
            {#if visitorNumber != null}
                <div>
                    <div
                        style:text-align="center"
                        style:width="fit-content"
                        style:float="right"
                        style:padding-right="min(6em, 20%)"
                        transition:fade={{duration: 200}}
                    >
                        <p>You are</p>
                        <p>{@html addPlacement(visitorNumberString)}</p>
                        {#if visitorNumberString === visitorNumber.toString()}
                            <p>visitor</p>
                        {/if}
                    </div>
                </div>
            {/if}
            <div style:clear="right"></div>
            <div class="quick-nav">
                <a class="big-nav-button" href="#my-work">My Work</a><a class="big-nav-button" href="#my-skills">My Skills</a>
            </div>
        </section>
    {/if}
    {#if showMyWork || import.meta.env.SSR || $page.data.introComplete}
        <section 
            in:fly={{y: 100}}
            id="myWorks"
            use:sectionObserver={"myWorks"}
        >
            <h2>My Works</h2>
            <MyWorks {projects} />
        </section>
    {/if}
    {#if showMySkills || import.meta.env.SSR || $page.data.introComplete}
        <section
            id="mySkills"
            use:sectionObserver={"mySkills"}
        >
            <h2>My Skills</h2>
            <MySkills {skills} />
        </section>
    {/if}
    {#if showAboutMe || import.meta.env.SSR || $page.data.introComplete}
        <section
            id="aboutMe"
            use:sectionObserver={"aboutMe"}
            style:position="relative"
        >
            <h2>About Me</h2>
            <div
                style:position="relative"
            >
                <p style:opacity="0" class="about-me">{aboutMe}</p>
                <div
                    style:position="absolute"
                    style:top="0"
                    style:left="0"
                    style:bottom="0"
                    style:right="0"
                >
                    <p 
                        style:position="absolute" 
                        style:left="50%"
                        style:translate="-50%"
                        style:margin="0"
                        class="about-me"
                    >{typedAboutMe}</p>
                </div>
            </div>
        </section>
    {/if}
    {#if showContact || import.meta.env.SSR || $page.data.introComplete}
        <section
            id="contacts"
            use:sectionObserver={"contacts"}
            style:height="calc(100vh - 3rem)"
            style:position="relative"
        >
            <h2>Contacts</h2>
            <div
                style:position="absolute"
                style:top="50%"
                style:left="50%"
                style:translate="-50% -50%"
                style:display="flex"
                style:flex-direction="column"
                style:gap="1rem"
                style:font-size="1.4rem"
                style:max-width="80%"
                class="contacts"
            >
                <a href="tel:8481860425" target="_blank"><svg
                        width="1em"
                        height="1em"
                        viewBox="-3 -3 23 23"
                        use:svgExtend={phoneSvg}
                    ></svg>8481860425</a>
                <a href="mailto:subhmabhsubhmabh@gmail.com" target="_blank">
                    <svg use:svgExtend={gmailSvg} height="0.7em"></svg>subhambhsubhambh@gmail.com</a>
                <a href="https://www.linkedin.com/in/subham-bhattacharjee-ab82bb205/" target="_blank">
                    <svg
                        width="1em"
                        height="1em"
                        viewBox="0 -6 24 30"
                        use:svgExtend={linkedinSvg}
                    >
                    </svg>Linked In</a>
                <a href="https://github.com/SBHattarj" target="_blank"><svg
                    width="1em"
                    height="1em"
                    viewBox="-3 -6 23 26"
                    use:svgExtend={githubSvg}
                />Github</a>
            </div>
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
    
    .typed-quote
        float: right
        width: 50%
        .typed-name
            width: max-content
            margin-left: 10ch
        @media(max-width: 60ch)
            width: 40vw
            .typed-name
                margin-left: 0
                width: fit-content
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
            position: absolute
            height: 3rem
            --width: max(min(60vw, 50vh, 100vh - 16em), 10rem)
            width: min(24vw, 100vh - 40em, 40ch)
            top: 8em
            height: calc( 4 / 5 * var(--width))
            --pos: calc(50vw)
            transition: transform 1s ease-in
            @for $i from 1 through 2
                &:nth-child(#{$i})
                    #{if($i == 1, left, right)}: var(--pos)
                    transform: translate(calc(#{(1.5 - $i) * 2} * var(--bigButtonTransition)))
        @media (max-width: 150ch)
            position: relative
            display: flex
            top: 0
            justify-content: center
            .big-nav-button
                position: relative
                --pos: 24vw
                top: 0
                --width: 33vw
                width: 34vw
                height: auto
                padding: 0.5rem
        @media (max-width: 110ch)
            --pos: 10vw
    .dev-mode-button
        position: fixed
        bottom: 6em
        left: 50%
    header
       transition: transform 1s ease-in
       transform: var(--headerTransition)
    section
        &:nth-child(2n)
            background-color: var(--mainStyles-mainBackgroundColor-dark)
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
    .about-me
        width: min(60ch, 80vw)
        font-size: 1.5rem
    #contacts
        a
            text-align: left
            overflow: hidden
            text-overflow: ellipsis
</style>
