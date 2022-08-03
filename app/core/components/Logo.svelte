<script lang="ts">
    import Animation, { type Frame } from "app/core/utils/animation"
import { sleep } from "../utils/async";
    export let width = "30vw"
    export let top = "1rem"
    export let left = "1rem"
    export let position: "relative" | "absolute" | "fixed" | "sticky" = "relative"
    export let scale = 1
    const animation = new Animation()
        .frame({
            class: "frame-1",
            delay: 1000,
            duration: 10000,
        })
    let logoClass = "logo"
    let partClass = ""
    let partClasses: {[key: string]: string} = {}
    ;(async () => {
        for await (const frame of animation) {
            console.log(frame)
            logoClass = frame.class != null ? `logo-animation ${frame.class}` : "logo"
            partClass = frame.class ?? ""
            partClasses = {
                ...partClasses,
                ...Object.entries(frame.children ?? {})
                    .reduce(
                        (newPartClasses, [key, childFrame]) => ({
                            ...newPartClasses,
                            [key]: childFrame.class ?? partClasses[key]
                        }), 
                        {} as {[key: string]: string}
                    )
            }
        }
        logoClass = "logo"
    })()
</script>
<div 
    use:animation.svelte 
    class="{logoClass}" 
    style="--width: max(1.3vw, {width}); top: {top}; left: {left}; position: {position} --scale: {scale}"
>
    {#each Array(12) as _, i}
        <div class="logo-part logo-part--{i} {partClasses?.[`logo-part--${i}`] ?? partClass}"></div>
    {/each}
</div>

<style lang="sass">
    @function timeTaken($total-distance, $distance-unit, $total-time, $time-unit, $distance)
        @return calc()
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
        $bg-color-main: #5AFF00
        $bg-color-secondary: #00E7FF
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
        :is(.frame-0, .frame-1, .frame-2).logo-part
            --x-ofset: 50vw
            --y-ofset: 0px
            $x-ofset: var(--x-ofset)
            $y-ofset: var(--y-ofset)
            &--
                &0
                    transform: rotate(90deg) translate($y-ofset, calc(-1 * $part-width - $x-ofset))
                    transform-origin: top left
                &1, &3
                    transform: translate($x-ofset, $y-ofset)
                &2
                    transform: rotate(-90deg) translate(calc(-0.525 * $part-width - $y-ofset), calc(-1.5 * $part-width + $x-ofset))
                &4
                    transform: rotate(-90deg) translate(calc( -1 * $y-ofset), $x-ofset)
                &5
                    transform: translate($x-ofset, calc(-3.16 * $part-width + $y-ofset))
                &6
                    transform: translate(calc(2.5 * $part-width + $x-ofset), calc(-3.16 * $part-width + $y-ofset)) rotate(90deg)
                &7
                    transform: translate($x-ofset, calc(-3.16 * $part-width + $y-ofset))
                &8
                    transform: translate($x-ofset, calc(-2.16 * $part-width + $y-ofset)) rotate(90deg)
                &9, &10
                    transform: translate($x-ofset, calc(-4.75 * $part-width + $y-ofset))
                &11
                    transform: rotate(90deg) translate(calc(-4.75 * $part-width + $y-ofset), calc(-1 * $x-ofset))
</style>