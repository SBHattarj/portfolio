<script lang="ts">
    import "../app.sass"
    import Info from '$lib/core/components/Info.svelte';
    import { MainStyles } from '$lib/core/stores/styles';
    import { infoStore, InfoStayTime, InfoSlidDuration } from '$lib/core/stores/Info';
    import { dev } from "$app/environment";
    import { onMount } from "svelte";
    import { convertAllToCssVariables } from "$lib/core/utils/node"
    import J from "jquery"

    onMount(() => {
            // @ts-ignore
            import("css-has-pseudo/browser").then(({ default: cssHasPseudo }) => {
                cssHasPseudo(document, {hover: true, debug: dev})
            })
            const fr = new FileReader()
            let lastFrLoad = (_: ProgressEvent<FileReader>) => {};
            function setFileInputSetBackground(input: JQuery<HTMLInputElement> | HTMLInputElement) {
                const Jinput = J(input)
                if(Jinput.length < 1) return
                fr.removeEventListener("load", lastFrLoad)
                const file = Jinput[0].files?.[0];
                if(file == null) {
                    Jinput.css("--folder-image", "url('/folder-new.svg')");
                    return
                }
                if(file.type.startsWith("image/")) {
                    lastFrLoad = function frLoad(e: ProgressEvent<FileReader>) {
                        const result = e.target?.result;
                        if(result != null) {
                            Jinput.css("--folder-image", `url("${result}")`)
                        }
                        e.target?.removeEventListener("load", frLoad)
                    }
                    fr.addEventListener("load", lastFrLoad)
                    fr.readAsDataURL(file)
                }
                Jinput.css("--folder-image", "url('/folder-filled.svg')")
                
            }
            function singleFileInput(e: JQuery.TriggeredEvent) {
                setFileInputSetBackground(J(e.target))
            }
            const inputSelector = "input[type='file']:not([multiple])"
            J("body").on("input", inputSelector, singleFileInput)
            setFileInputSetBackground(J(inputSelector))

            return () => {
                J("body").off("input", inputSelector, singleFileInput)
                fr.removeEventListener("load", lastFrLoad)
            }
    })
</script>
<svelte:head>
    {@html `
        <${"style>"}
            :root {
                ${convertAllToCssVariables($MainStyles)}
            }
        </style>
    `}
</svelte:head>

<slot></slot>
<Info info="{$infoStore}" stayTime="{$InfoStayTime}" slideDuration="{$InfoSlidDuration}"></Info>
<style lang="sass">
    :global(html)
        --mainStyles-mainBackgroundColor-accent: var(--mainStyles-mainBackgroundColor-accent)
        --mainStyles-mainBackgroundColor-highlight: var(--mainStyles-mainBackgroundColor-highlight)
        --mainStyles-mainBackgroundColor-light: var(--mainStyles-mainBackgroundColor-light)
        --mainStyles-mainBackgroundColor-dark: var(--mainStyles-mainBackgroundColor-dark)
        --mainStyles-mainBackgroundColor-inactive: var(--mainStyles-mainBackgroundColor-inactive)

        --mainStyles-fontColor-main: var(--mainStyles-fontColor-main)
        --mainStyles-fontColor-highlight: var(--mainStyles-fontColor-highlight)
        --mainStyles-spacing-normal: var(--mainStyles-spacing-normal)

        --mainStyles-borderRadius-normal: var(--mainStyles-borderRadius-normal)
        --mainStyles-spacing-small: var(--mainStyles-spacing-small)


        --mainStyles-fadedColor-light: var(--mainStyles-fadedColor-light)
        --mainStyles-fadedColor-highlight: var(--mainStyles-fadedColor-highlight)

        --mainStyles-fontHighlightColors-_0: var(--mainStyles-fontHighlightColors-_0)
        --mainStyles-fontHighlightColors-_1: var(--mainStyles-fontHighlightColors-_1)


        @for $i from 1 through 3
            --mainStyles-indentBorderColors-_#{($i - 1)}: var(--mainStyles-indentBorderColors-_#{($i - 1)})
            --mainStyles-indentBackgroundColor-_#{($i - 1)}: var(--mainStyles-indentBackgroundColors-_#{($i - 1)})


</style>
