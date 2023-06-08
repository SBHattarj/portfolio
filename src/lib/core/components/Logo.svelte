<script lang="ts">
	import { MainStyles } from '$lib/core/stores/styles';
    import Animation from "$lib/core/utils/Animation"
    import {createEventDispatcher} from "svelte"

    const dispatch = createEventDispatcher<{
        "animation-play": null,
        "animation-end": null
    }>()

    $: mainStyles = $MainStyles

    export let width = "min(60vw, 50vh)"
    export let top = "1rem"
    export let left = "1rem"
    export let marginTop = "0"
    export let marginLeft = "0"
    export let marginBottom = "0"
    export let marginRight = "0"
    export let position: "relative" | "absolute" | "fixed" | "sticky" = "relative"
    export let scale = 1
    export let animateOnEnter = false
    const animation = new Animation()
        .frame({
            class: "frame-0",
            duration: 10
        })
        .frame({
            class: "frame-1",
            duration: 400,
        })
        .frame({
            class: "frame-2",
            duration: 300
        })
        .frame({
            class: "frame-3",
            duration: 320
        })
        .frame({
            class: "frame-4",
            duration: 300
        })
        .frame({
            class: "frame-4",
            children: {
                ".logo-part--0, .logo-part--4, .logo-part--3, .logo-part--7, .logo-part--8": {
                    class: "frame-4--1"
                }
            },
            duration: 360
        })
        .frame({
            class: "frame-4",
            children: {
                ".logo-part--0, .logo-part--4, .logo-part--3": {
                    class: "frame-4--1"
                },
                ".logo-part--7, .logo-part--8, .logo-part--9, .logo-part--10": {
                    class: "frame-4--2"
                }
            },
            duration: 360
        })
        .frame({
            class: "frame-5",
            duration: 500
        })
        .frame({
            duration: 20
        })
    let logoClass = animateOnEnter ? "logo-animation" : "logo-animation"
    if(animateOnEnter) animation.play()
    animation.onPlay(_ => {
        dispatch("animation-play")
    })
    animation.onFinnish(_ => {
        dispatch("animation-end")
    })
</script>
<div
    use:animation.svelte
    class="{logoClass}"
    style:--width="max(1.3vw, {width})"
    style:top
    style:left
    style:position
    style:margin-top={marginTop}
    style:margin-left={marginLeft}
    style:margin-bottom={marginBottom}
    style:margin-right={marginRight}
>
    {#each Array(12) as _, i}
        <div class="logo-part logo-part--{i}"></div>
    {/each}
</div>

<style lang="sass">
    /* table of content
        1. logo
            1.1. logo part
            1.2. logo part 1, 3, 4, 5, 7, 9, 10
            1.3. logo part 2, 6, 8
            1.4. logo part 11


    $part-width: calc(var(--width) / 5.3)

    // 1. logo
    .logo, .logo-animation
        height: calc(6.8 * $part-width)
        width: calc(5.3 * $part-width)
        position: relative
        transform: scale(var(--scale))
        /* 1.1 logo part
    .logo-part
        $bg-color-main: var(--mainStyles-mainBackgroundColor-highlight)
        $bg-color-secondary: var(--mainStyles-backgroundHighlightColors-_0)
        width: $part-width
        height: calc(3 * $part-width)
        background-color: $bg-color-main
        margin-top: calc(var(--width) / 10)
        margin-bottom: calc(var(--width) / 10)
        margin-left: 0
        margin-right: 0
        position: absolute
        transform-origin: top right
        &--
            &0
                right: 0
                height: calc(3.17 * $part-width)

            /* 1.2 logo part 1, 3, 5, 7, 9, 10

            &1, &3, &5, &7, &9, &10
                width: auto
                height: $part-width
            &1
                right: 0
                left: calc(2.5 * $part-width)
            &3
                left: 0
                right: calc(var(--width) - 1.55 * $part-width)
                transform: skew(10deg)
            &4
                height: calc(3.17 * $part-width)
            &5, &6
                transform-origin: top left
            &5
                top: calc(3.16 * $part-width)
                left: 0
                right: calc(2.2 * $part-width)
            &7
                top: calc(3.16 * $part-width)
                right: calc(0.5 * $part-width)
                left: calc(var(--width) - 1.9 * $part-width)
                transform: skew(10deg)

            &9
                bottom: 0
                transform-origin: bottom right
                right: 0
                left: calc(var(--width) - 1 * $part-width)
                height: calc(1 * $part-width)
            &10
                transform: skew(10deg)
                bottom: 0
                left: calc(var(--width) - 1.6 * $part-width)
                right: calc(0.5 * $part-width)

            /* 1.3 logo part 2, 6, 8
            &2, &6, &8
                height: auto
            &2, &6
                background-color: $bg-color-secondary
                transform: skew(10deg)
                z-index: 12

            &2
                left: calc(1.6 * $part-width)
                top: calc(-0.1 * var(--width))
                bottom: calc(2.77 * $part-width)
                z-index: 12
            &6
                top: calc(3.16 * $part-width)
                left: calc(2.255 * $part-width)
                bottom: calc(-0.1 * var(--width))
            &8
                bottom: 0
                top: calc(3.16 * $part-width)
                right: 0

            /* 1.5 logo part 11
            &11
                transform-origin: bottom left
                bottom: $part-width
                height: calc(3.4 * $part-width)
                transform: rotate(90deg)
    .logo-animation
        &:is(.frame-0, .frame-1, .frame-2, .frame-3, .frame-4)
            --x-offset: 0px
            --y-offset: 0px
            $x-offset: var(--x-offset)
            $y-offset: var(--y-offset)
            .logo-part--
                &0
                    transform: rotate(90deg) translate($y-offset, calc(-1 * $part-width - $x-offset))
                    transform-origin: top left
                &1, &3
                    transform: translate($x-offset, $y-offset)
                &2
                    --rotate: 90deg
                    transform: rotate(calc(-1 * var(--rotate))) translate(calc(-0.525 * $part-width - $y-offset), calc(-1.5 * $part-width + $x-offset))
                &4
                    transform: rotate(-90deg) translate(calc( -1 * $y-offset), $x-offset)
                &5
                    transform: translate($x-offset, calc(-3.16 * $part-width + $y-offset))
                &6
                    --rotate: 90deg
                    transform: translate(calc(2.5 * $part-width + $x-offset), calc(-3.16 * $part-width + $y-offset)) rotate(var(--rotate))
                &7
                    transform: translate($x-offset, calc(-3.16 * $part-width + $y-offset))
                &8
                    transform: translate($x-offset, calc(-2.16 * $part-width + $y-offset)) rotate(90deg)
                &9, &10
                    transform: translate($x-offset, calc(-4.75 * $part-width + $y-offset))
                &11
                    transform: rotate(90deg) translate(calc(-4.75 * $part-width + $y-offset), calc(-1 * $x-offset))
        &.frame-0
            --x-offset: -100vw
        &.frame-1
            .logo-part
                transition: transform 500ms cubic-bezier(0.7, 1.5, 1, 1)
        &.frame-2 .logo-part--
            &5, &11
                --x-offset: 100vw
                transition: transform 300ms
        &.frame-3 .logo-part--
            &5, &11
                --x-offset: -100vw
            &5
                --y-offset: calc(3.16 * calc(var(--width) / 5.3))
            &11
                --y-offset: calc(4.75 * calc(var(--width) / 5.3))

            &2, &6
                transform: none
                transition: transform 300ms,
            &6
                translate: calc(-0.65 * $part-width)
        &.frame-4 .logo-part--
            &5, &11
                transition: transform 200ms cubic-bezier(0.5, 0.65, 0.9, 0.95)
            &2, &6
                transition: transform 200ms, translate 200ms
            &5
                transform: none
            &11
                transform: rotate(90deg)
            &2, &6
                transform: skew(10deg)
                transition: transform 200ms 70ms cubic-bezier(0.5, 0.9, 0.9, 0.95), translate 300ms 70ms
            &0.frame-4--1
                transform: none
                transition: transform 300ms cubic-bezier(0.6, 1.6, 0.9, 0.98)
            &4.frame-4--1
                transform: none
                transition: transform 300ms cubic-bezier(0.6, 1.6, 0.9, 0.98)
            &3.frame-4--1
                transform: skew(10deg)
                transition: transform 300ms cubic-bezier(0.3, 0.95, 1, 1)
            &7.frame-4--1
                transform: translate(calc($part-width / 2)) rotate(90deg)
                transition: transform 0s 320ms
            &8.frame-4--1
                transform: translate(0, -100%)
                transition: transform 0s 320ms
            &7.frame-4--2
                transform: skew(10deg)
                transition: transform 300ms cubic-bezier(0.4, 1.6, 0.9, 0.95)
            &8.frame-4--2
                transform: none
                transition: transform 300ms cubic-bezier(0.2, 1.6, 0.7, 0.6)
            &9.frame-4--2
                transform: none
                transition: transform 0s 320ms
            &10.frame-4--2
                transform: translate(46%, 100%) rotate(90deg)
                transition: transform 0s 320ms
        &.frame-5 .logo-part
            transition: transform 500ms cubic-bezier(0.2, 1.8, 0.7, 0.6)


</style>