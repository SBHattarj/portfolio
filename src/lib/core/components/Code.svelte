<script lang="ts">
    import { onMount } from 'svelte';
    import Highlight from 'svelte-highlight';
    import type {LanguageType} from "svelte-highlight/languages"
    import J from "jquery"
    let mutationObserver: MutationObserver
    let code = ""
    export let language: LanguageType<string>
    let preEll: HTMLElement
    onMount(() => {
        if(!mutationObserver) mutationObserver = new MutationObserver(mut => {
            mut.forEach(m => {
                let tabSize = -1
                code = J(preEll).text().split('\n').map(line => {
                    if(tabSize === -1) {
                        tabSize = line.search(/[^\t\s]/)
                    }
                    return line.substring(tabSize)
                }).join('\n')
            })
        })
        mutationObserver.observe(preEll, {
            childList: true,
            subtree: true,
            characterData: true
        })
        return () => {
            mutationObserver.disconnect()
        }
    })
</script>

<pre bind:this={preEll} style:display="none">
    <slot />
</pre>

<Highlight {code} {language} />
