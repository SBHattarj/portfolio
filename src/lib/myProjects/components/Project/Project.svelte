<script lang="ts">
    import type {ProjectData} from "./types"
    import toPx from "to-px"
    import { MainStyles } from "$lib/core/stores/styles";
    import { offsetObserve, type offsetEventDetail } from "$lib/myProjects/utils/offsetObserve";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher<{
        offsetChange: offsetEventDetail,
        wheel: {container: HTMLElement}
        }>()
    $: mainStyles = $MainStyles
    export let projectData: ProjectData
    let aWidth = 0
    let aHeight = 0
    let iframeWidth = 0
    let iframeHeight = 0
    $: scale = Math.min((aWidth - (toPx?.("2em") ?? 0)) / iframeWidth, (aHeight - (toPx?.("2em") ?? 0)) / iframeHeight) 
    $: scaledIframeWidth = iframeWidth * scale
    $: scaledIframeHeight = iframeHeight * scale
    export let offsetX = 0
    $: console.log(offsetX)
    let container: HTMLElement
</script>
<div 
    class="project-card-container" 
    use:offsetObserve 
    bind:this={container}
    on:wheel={() => {
       dispatch("wheel", {container})
   }}
    on:offsetChange 
>
    <div 
        class="project-card" 
        style:scroll-snap-align="center"
    >
        <div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <p>{projectData.description}</p>
        </div>
        <a href={projectData.url} bind:clientWidth={aWidth} bind:clientHeight={aHeight}>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div class="hoverer"></div>
            <div 
                style:width={`${scaledIframeWidth}px`} 
                style:height={`${scaledIframeHeight}px`} 
                style:position="relative" 
                style:padding="0"
                style:border-radius={mainStyles.borderRadius.normal}
                style:overflow="hidden"
            >
                <iframe 
                    title={projectData.name} 
                    src={projectData.url} 
                    bind:clientWidth={iframeWidth} 
                    bind:clientHeight={iframeHeight} 
                    style:position="absolute" 
                    style:top="0" 
                    style:left="0" 
                    style:transform-origin="0 0" 
                    style:border="none" 
                    style:transform={`scale(${scale})`}
                />
            </div>
            <h3>{projectData.name}</h3>
        </a>
    </div>
</div>



<style lang="sass">
    @use "sass:math"
    @import "$lib/myProjects/utils/animation.sass"
    $width: 40ch
    $aspect-ratio: 2.77 / 3
    a
        padding: 1rem
        display: block
        width: $width
        aspect-ratio: $aspect-ratio

    iframe
        width: 100vw
        aspect-ratio: 3 / 2.77  
        pointer-events: none
    h3
        font-size: 1.7rem
    .project-card-container
        display: inline-block
        position: relative
        width: calc(2.8rem + $width)
        aspect-ratio: $aspect-ratio
        margin: 4rem
        margin-inline: 5rem
        padding: 0
    .project-card-container > .project-card
        display: block
        position: absolute
        top: 0
        left: 0
        width: calc(2.8rem + $width)
        aspect-ratio: $aspect-ratio
        transform-origin: center
        transition: transform 0.25s 3s ease-in, scale 0.2s ease
        perspective: 100em
        & > div
            position: absolute
            top: 0.2rem
            left: 0.2rem
            padding: 1em
            transition: transform 0.25s 3s ease-in, box-shadow 0.25s
            border-radius: var(--mainStyles-borderRadius-normal)
            width: $width
            aspect-ratio: $aspect-ratio
            background-color: var(--mainStyles-mainBackgroundColor-dark)
            text-shadow: 1px 0px 0 red, 0px 1px 0 red, -1px 0px 0 red, 0px -1px 0 red, 0px 0px 3em red
            color: var(--mainStyles-mainBackgroundColor-dark)
            letter-spacing: 2px
            &::before
                content: ""
                display: block
                position: absolute
                inset: -1px
                border-radius: inherit
                background-image: conic-gradient(from calc(var(--border-rotation) - 45deg), rgb(255, 2, 48) 25%, transparent 45% 50%,rgb(255, 2, 48) 50% 75%, transparent 95% 100%)
                z-index: -2
                @include animation($duration: 1.5s, $iteration-count: infinite, $play-state: paused)
                    @for $i from 0 through 1000
                        #{$i/10}%
                            background-image: conic-gradient(from #{$i / 1000 * 360}deg, rgb(255, 2, 48) 25%, transparent 45% 50%,rgb(255, 2, 48) 50% 75%, transparent 95% 100%)
            &:hover::before
                animation-play-state: running
            &::after
                content: ""
                display: block
                position: absolute
                inset: 0
                border-radius: inherit
                background-color: inherit
                z-index: -1
        a
            position: absolute
            top: 0.2rem
            left: 0.2rem
            transition: inherit
            margin: 0
            transition-delay: 3s
        .hoverer
            width: 0
            height: 0
            position: absolute
            z-index: 99999
            top: 0
            left: 0
            transition: top 3s 0s, left 3s 0s, width 2s 0s, height 3s 0s

        &:hover
            scale: 1.05
            z-index: 1
            
            :has(.hoverer:nth-child(1):hover)
                --rotateX: 5deg
                --rotateY: 5deg
            :has(.hoverer:nth-child(2):hover)
                --rotateX: 0deg
                --rotateY: 5deg
            :has(.hoverer:nth-child(3):hover)
                --rotateX: -5deg
                --rotateY: 5deg
            :has(.hoverer:nth-child(4):hover)
                --rotateX: 5deg
                --rotateY: 0deg
            :has(.hoverer:nth-child(5):hover)
                --rotateX: -5deg
                --rotateY: 0deg
            :has(.hoverer:nth-child(6):hover)
                --rotateX: 5deg
                --rotateY: -5deg
            :has(.hoverer:nth-child(7):hover)
                --rotateX: 0deg
                --rotateY: -5deg
            :has(.hoverer:nth-child(8):hover)
                --rotateX: -5deg
                --rotateY: -5deg
            :has(.hoverer:hover)
                transition-delay: 0s
            a
                animation-fill-mode: forwards
                animation-duration: 1s
                animation-name: transitionBack
                --rotateY: 0deg
                --rotateX: 0deg
                transform: translateX(40%) rotateY(calc(-45deg - var(--rotateY))) rotateX(var(--rotateX))
                &::after
                    content: ""
                    position: absolute
                    top: -2%
                    left: -2%
                    width: 104%
                    height: 104%

            .hoverer
                width: 25%
                height: 25%
                &:nth-child(1)
                    top: 0
                    left: 0
                &:nth-child(2)
                    top: 25%
                    height: 50%
                    left: 0
                &:nth-child(3)
                    top: 75%
                    left: 0
                &:nth-child(4)
                    top: 0
                    left: 25%
                    width: 50%
                &:nth-child(5)
                    top: 75%
                    left: 25%
                    width: 50%
                &:nth-child(6)
                    top: 0
                    left: 75% 
                &:nth-child(7)
                    top: 25%
                    left: 75%
                    height: 50%
                &:nth-child(8)
                    top: 75%
                    left: 75%
            & > div
                --rotateY: 0deg
                --rotateX: 0deg
                transform: translateX(-40%) rotateY(calc(45deg - var(--rotateY))) rotateX(var(--rotateX))
                &:hover
                    box-shadow: 0px 0px 3em -3px rgb(255, 2, 48)
</style>
