<script lang="ts">
    import Animation, {type Frame} from "$lib/core/utils/Animation";

    export let frames: Frame[] = [];
    export let defaultFrame: Frame = {}
    const animation = new Animation(defaultFrame)
    $: {
        animation.emptyFrame()
        for(let frame of frames) {
            $animation.frame(frame)
        }
    }

    export let play = () => {
        animation.play()
    }
    $: play = () => {
        $animation.play()
    }
    export let pause = () => {
        animation.pause()
    }
    $: pause = () => {
        $animation.pause()
    }
    $: bind = (node: HTMLElement) => $animation.bind(node)
</script>

<slot bind={bind} transition={$animation.toTransition()} />