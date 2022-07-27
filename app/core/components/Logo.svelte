<script lang="ts">
    export let width = "25vw"
    export let top = "2rem"
    export let left = "1rem"
</script>
<div style="--width: {width}; --top: {top}; --left: {left}" class="logo">
    {#each Array(13) as _, i}
        <div class="logo-part logo-part--{i}">{i}</div>
    {/each}
</div>

<style lang="sass">
    .logo
        $part-width: calc(var(--width) / 6)
        height: calc(6.8 * $part-width)
        width: calc(6 * $part-width)
        top: var(--top)
        left: var(--left)
        position: relative
        background-color: red
        .logo-part
            $bg-color-main: #5AFF00
            $bg-color-secondary: #00E7FF
            width: $part-width
            height: calc(3 * $part-width)
            background-color: $bg-color-main
            margin: 2vw
            position: absolute
            transform-origin: top right
            &--
                &0
                    right: 0
                    height: calc(3.17 * $part-width)
                &1
                    width: auto
                    height: $part-width
                    right: 0
                    left: calc(2.5 * $part-width)
                &2, &6
                    &::before, &::after
                        content: ""
                        display: block
                        width: $part-width
                        background-color: inherit
                        position: absolute
                    
                    &::before
                        height: $part-width
                        transform: skewY(10deg)
                        top: calc(-0.1 * $part-width)
                    
                &2
                    transform: rotate(-10deg)
                    height: calc(3.5 * $part-width)
                    left: calc(1.8 * $part-width)
                    top: calc(-0.65 * $part-width)
                    background-color: $bg-color-secondary
                    z-index: 12
                    &::after
                        height: calc(4 * $part-width / 3)
                        transform: rotate(10deg) skew(10deg)
                        top: calc(2.246 * $part-width)

                &3
                    transform: rotate(-90deg)
                    left: calc(-0.1 * $part-width)
                    height: calc(0.45 * $part-width)
                    &::after
                        content: ""
                        display: block
                        height: calc(2 * $part-width / 3)
                        width: $part-width
                        position: absolute
                        transform: skewY(-10deg)
                        bottom: calc(-0.4 * $part-width)
                        background-color: $bg-color-main
                &4
                    height: calc(3.17 * $part-width)
                &5, &6
                    transform-origin: top left
                &5
                    top: calc(4.16 * $part-width)
                    transform: rotate(-90deg)
                    height: calc(3.3 * $part-width)
                &6
                    transform: rotate(-10deg)
                    top: calc(3.3476 * $part-width)
                    left: calc(2.485 * $part-width)
                    height: calc(4.4 * $part-width)
                    background-color: $bg-color-secondary
                    z-index: 12
                    &::after
                        bottom: calc(-0.1 * $part-width)
                        transform: skewY(10deg)
                        height: $part-width
                &7
                    top: calc(3.16 * $part-width)
                    height: $part-width
                    width: auto
                    right: 0
                    left: calc(4.05 * $part-width)
                    &::after
                        content: ""
                        display: block
                        width: $part-width
                        height: $part-width
                        background-color: inherit
                        transform: skew(10deg)
                        position: absolute
                        left: -25%
                        top: 0
                &8
                    bottom: calc(0.8 * $part-width)
                    height: auto
                    top: calc(3.16 * $part-width)
                    right: 0
                &9
                    bottom: 0
                    transform-origin: bottom right
                    height: $part-width
                    width: auto
                    right: 0
                    left: calc(4.5 * $part-width)
                    height: calc(1 * $part-width)
                &10
                    transform: skew(10deg)
                    height: $part-width
                    width: calc(.7 * $part-width)
                    bottom: 0
                    left: calc(4 * $part-width)
                &11
                    transform-origin: bottom left
                    bottom: $part-width
                    height: calc(3.4 * $part-width)
                    transform: rotate(90deg)
</style>