<script lang="ts">
	import { MainStyles } from '$lib/core/stores/styles';
	import { sleep } from "../utils/async";
	import Animation from "./Animation.svelte";

    $: mainStyles = $MainStyles

    let infoIdCurrent = 0

    export let info: {text: string, class?: "normal" | "info"} | null = null
    export let stayTime: number = 3000
    export let slideDuration: number = 1000

    $: currentInfo = {text: "", ...info, id: infoIdCurrent++}
    let infos: {text: string, class: "normal" | "info", id: number}[] = []

    $: {
        infos = info == null ? infos : [...infos, {class: "normal", ...info, id: infoIdCurrent++}]
        info = null
    }
    $: (async () => {
        if(infos.length < 1) return
        await sleep(stayTime)
        ;[, ...infos] = infos
    })()
</script>

{#each infos as {text, class: className, id} (`text=${text};class=${className};id=${id}`)}
    <Animation frames={[
        {
            css: {
                translate: "-50% 50vh",
                transition: `translate ${slideDuration}ms`
            },
            duration: slideDuration
        },
        {
            css: {
                translate: "-50% 0",
                transition: `translate ${slideDuration}ms`
            },
            duration: slideDuration
        }
    ]} let:transition>
        <p class={className} transition:transition>{text}</p>
    </Animation>
{/each}

<style lang="sass">
    p
        bottom: 2em
        position: fixed
        left: 50%
        background-color: var(--mainStyles-mainBackgroundColor-light)
        padding-inline: 1em
        padding-block: 0.3em
        border-radius: 1em
        border: solid 0.2ch
        max-width: 40ch
        text-align: center
        z-index: 999999999999

    p.info
        color: var(--mainStyles-mainBackgroundColor-highlight)
        bottom: 5em
        font-weight: bold

</style>