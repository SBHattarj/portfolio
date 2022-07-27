<script lang="ts">
    import Title from "app/core/symbols/title"
    import { setContext } from "svelte-typed-context";
    import { writable } from "svelte/store";

    const title = writable("subham")

    setContext(Title, title)
</script>

<svelte:head>
    <title>{$title}</title>
    {@html import.meta.env.DEV ? `<script src="//cdn.jsdelivr.net/npm/eruda"></script>
    <script>eruda.init();</script>` : ''}
</svelte:head>

<slot />

<style lang="sass" global>
    body
        background-color: hsl(0deg, 5%, 5%)
        color: hsl(0deg, 0%, 100%)
</style>