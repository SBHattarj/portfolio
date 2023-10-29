<script lang="ts">
    import { page } from "$app/stores";
    import { MainStyles } from "$lib/core/stores/styles";
    $: mainStyles = $MainStyles
    $: breadCrumbs = $page.url.pathname.split("/").filter(crumb => crumb !== "").reduce((acc, crumb) => {
        acc.push({crumb, path: `${acc.at(-1)?.path ?? ""}/${crumb}`})
        return acc
        
    }, [] as {crumb: string, path: string}[]);
    $: console.log(breadCrumbs)
</script>
<header>
    <nav>
        <ol>
            {#each breadCrumbs as crumb}
                <li><a href={crumb.path}>/{crumb.crumb}</a></li>
            {/each}
        </ol>
    </nav>
</header>

<slot />

<style lang="sass">
    header
        position: relative
        display: block
        height: auto
        nav
            position: relative
            display: block
            background-color: var(--mainStyles-mainBackgroundColor-inactive)
            margin-top: 0
            padding: 0.5rem
            margin-bottom: 0.5rem
            box-shadow: none
            ol 
                padding: 0
                margin: 0
                li
                    list-style: none
                    display: inline-block
                    a
                        outline: none
                        background-color: transparent
                        padding-left: 0
                        padding-right: 1ch
                        padding-block: 0.1em
                        font-size: 1.2rem
                        color: var(--mainStyles-fontColor-highlight)
                        border-radius: 0
                        &:hover
                            background-color: var(--mainStyles-mainBackgroundColor-light)

</style>
