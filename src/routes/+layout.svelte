<script lang="ts">
	import Info from '$lib/core/components/Info.svelte';
	import { MainStyles } from '$lib/core/stores/styles';
    import { infoStore, InfoStayTime, InfoSlidDuration } from '$lib/core/stores/Info';

    $: mainStyles = $MainStyles
</script>

<slot />
<Info info={$infoStore} stayTime={$InfoStayTime} slideDuration={$InfoSlidDuration} />
<style lang="sass" global>
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



</style>