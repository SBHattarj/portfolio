<script context="module" lang="ts">
    import createSectionObserver from "$lib/core/stores/section";
    import { writable } from "svelte/store";
    export type CertLink = {
        text: string
        url: string
    }
    const skillObserver = createSectionObserver();
    let id = 0;
    const skillsObservedList = writable<{
        cardVisible: boolean,
        isObserved: boolean
    }[]>([])
</script>
<script lang="ts">
    import { MainStyles } from "$lib/core/stores/styles";
    import { slide } from "svelte/transition";
    import { onMount } from "svelte";
    export let linkedInAssesment: "none" | CertLink | null | undefined = "none"
    export let certificate: "none" | CertLink | null | undefined = "none"
    export let name: string
    export let visibleDelay = 300
    export let visible = true
    let idSelf = id++;
    let cardVisible = false
    $: isObserved = $skillObserver.visibleSections.has(idSelf.toString())
    let cardData = {
        cardVisible,
        isObserved
    }
    let mounted = false
    onMount(() => {
        mounted = true
        if(visible) $skillsObservedList.push(cardData)
        return () => {
            mounted = false
        }
    })
    $: {
        if(visible && !$skillsObservedList.includes(cardData) && mounted) {
            $skillsObservedList.push(cardData)
        }
        else if(!visible) {
            $skillsObservedList.filter(data => data !== cardData)
        }
    }
    function makeVisible() {
        setTimeout(() => {
            cardVisible = true
            cardData.cardVisible = true
            cardData.isObserved = true
            $skillsObservedList = $skillsObservedList
        }, visibleDelay)
    }
    $: {
        if(isObserved && !cardVisible && visible) {
            let prevIndex = $skillsObservedList.indexOf(cardData) - 1
            const prevCardData = $skillsObservedList[prevIndex]
            if(prevIndex < 0) {
                makeVisible()
            }
            else if(prevCardData.cardVisible == prevCardData.isObserved && prevCardData.cardVisible) {
                makeVisible()
            }
        }
        if(!isObserved && isObserved !== cardVisible && visible) {
            cardVisible = isObserved
            cardData.cardVisible = false
            cardData.isObserved = false
            $skillsObservedList = $skillsObservedList
        }
    }
</script>

<div
    class="my-skill-card-root"
    use:skillObserver={idSelf.toString()}
>
    {#if import.meta.env.SSR || cardVisible && visible}
        <div
            in:slide={{axis: "x", duration: visibleDelay + 1000}}
            style:overflow="visible"
        >
            <div 
                class="my-skill-card"
                style:border-radius={$MainStyles.borderRadius.normal}
                style:background-color={$MainStyles.mainBackgroundColor.light}
                style:border-width={$MainStyles.spacing.small}
                style:border-color={$MainStyles.fontColor.highlight}
                style:--highlight-color={$MainStyles.fontColor.highlight}
                style:--color-disabled={$MainStyles.fadedColor.darkLight}
                style:--spacing={$MainStyles.spacing.small}
                style:--disabled={$MainStyles.fontColor.main}
                style:--background-color={$MainStyles.mainBackgroundColor.accent}
                style:--background-color-focus={$MainStyles.mainBackgroundColor.light}
                style:padding={$MainStyles.spacing.normal}
                style:float="right"
            >
                <div>
                    <slot />
                </div>
                <h4>{name}</h4>
                <div>
                    <span>ln assesment:</span>
                    {#if linkedInAssesment === "none" || linkedInAssesment == null}
                        <span class="certlink none">none</span>
                    {:else}
                        <a class="certlink" href={linkedInAssesment.url}>{linkedInAssesment.text}</a>
                    {/if}
                    <span>cert:</span>
                    {#if certificate === "none" || certificate == null}
                        <span class="certlink none">none</span>
                    {:else}
                        <a class="certlink" href={certificate.url}>{certificate.text}</a>
                    {/if}
                </div>
            </div>
        </div>
    {:else}
        <div 
            class="my-skill-card"
            style:border-radius={$MainStyles.borderRadius.normal}
            style:background-color={$MainStyles.mainBackgroundColor.light}
            style:border-width={$MainStyles.spacing.small}
            style:border-color={$MainStyles.fontColor.highlight}
            style:--highlight-color={$MainStyles.fontColor.highlight}
            style:--color-disabled={$MainStyles.fadedColor.darkLight}
            style:--spacing={$MainStyles.spacing.small}
            style:--disabled={$MainStyles.fontColor.main}
            style:--background-color={$MainStyles.mainBackgroundColor.accent}
            style:--background-color-focus={$MainStyles.mainBackgroundColor.light}
            style:padding={$MainStyles.spacing.normal}
            style:visibility="hidden"
        >
            <div
                style:display="flex"
                style:flex-direction="column"
                style:align-items="cneter"
            >
                <slot />
            </div>
            <h4>{name}</h4>
            <div>
                <span>ln assesment:</span>
                {#if linkedInAssesment === "none" || linkedInAssesment == null}
                    <span class="certlink none">none</span>
                {:else}
                    <a class="certlink" href={linkedInAssesment.url}>{linkedInAssesment.text}</a>
                {/if}
                <span>cert:</span>
                {#if certificate === "none" || certificate == null}
                    <span class="certlink none">none</span>
                {:else}
                    <a class="certlink" href={certificate.url}>{certificate.text}</a>
                {/if}
            </div>
        </div>
    {/if}
</div>


<style lang="sass">
    @import "$lib/core/utils/containerQuery.sass"
    $width: min(10ch, 60vw)
    .my-skill-card-root
        width: fit-content
        aspect-ratio: 1
    .my-skill-card
        width: fit-content
        aspect-ratio: 1
        border: solid
        h4
            text-align: center
            margin-bottom: 0.5rem
            overflow: hidden
            text-overflow: ellipsis
        & > div
            display: grid
            grid-template-columns: 1fr 1fr
            gap: var(--spacing)
            align-items: center
            span, a
                display: block
                text-align: start
                outline: none
            a:hover, a:focus
                background-color: var(--background-color-focus)
            .certlink
                margin-left: 1ch
                text-decoration: none
                color: var(--highlight-color)
                padding: var(--spacing)
                border-radius: var(--spacing)
                border: 0.2em solid
                background-color: var(--background-color)
                margin-right: 0
            .certlink.none
                border-width: 0.1em
                color: var(--color)
                background-color: var(--color-disabled)
                
</style>
