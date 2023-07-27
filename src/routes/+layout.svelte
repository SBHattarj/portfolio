<script lang="ts">
    import "../app.postcss";
    import Info from '$lib/core/components/Info.svelte';
    import { MainStyles } from '$lib/core/stores/styles';
    import { infoStore, InfoStayTime, InfoSlidDuration } from '$lib/core/stores/Info';
    import { browser, dev } from "$app/environment";
    import { onMount } from "svelte";

    onMount(() => {
        
            if(browser){
            // @ts-ignore
            import("css-has-pseudo/browser").then(({ default: cssHasPseudo }) => {
                    cssHasPseudo(document, {hover: true, debug: dev})
                    })
            }
    })
    $: mainStyles = $MainStyles
</script>

<slot></slot>
<Info info="{$infoStore}" stayTime="{$InfoStayTime}" slideDuration="{$InfoSlidDuration}"></Info>
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
    a
        color: var(--mainStyles-fontColor-main)
        vertical-align: middle
        transition: outline-width 0.2s
        background-color: var(--mainStyles-mainBackgroundColor-light)
        border-radius: var(--mainStyles-borderRadius-normal)
        outline: 0.2rem solid var(--mainStyles-mainBackgroundColor-highlight)
        text-align: center
        padding-inline: 1em
        margin-inline: 0.5em
        text-decoration: none
        &:hover, &:focus-visible
            outline-width: 0.4rem
    header
        position: fixed
        top: 0
        left: 0
        right: 0
        z-index: 4
        background-color: var(--mainStyles-mainBackgroundColor-light)
        height: 3rem
        box-shadow: 0px 1ch 1.5ch black
    nav
        position: absolute
        right: 0
        display: flex
        flex-direction: row
        align-items: center
        height: 100%
        justify-content: space-aroud
    pre.hljs
        background-color: var(--mainStyles-mainBackgroundColor-dark)
        padding: var(--mainStyles-spacing-normal)
        border-radius: var(--mainStyles-borderRadius-normal)
        margin: 0
        overflow: hidden
        .hljs-code-block
            min-width: 0px
            overflow: hidden
        .hljs-code-line
            min-width: 0px
            overflow: hidden
            display: flex
            white-space: pre-wrap
            flex-direction: row
        .hljs-whitespace
            white-space: pre
            &:not(:last-child)
                border-right: 0.1em solid
            @for $i from 1 through 3
                &:nth-child(3n+#{$i})
                    color: var(--mainStyles-indentBorderColors-_#{($i - 1)})
                    background-color: var(--mainStyles-indentBackgroundColors-_#{($i - 1)})
                    word-wrap: none
        .hljs-line-id
            padding-right: var(--mainStyles-spacing-small)
            margin-right: var(--mainStyles-spacing-normal)
            border-right: 1px solid var(--mainStyles-fadedColor-light)
            height: 100%
            display: block
            color: var(--mainStyles-fadedColor-highlight)
            text-align: right
        .hljs-comment
            color: var(--mainStyles-fadedColor-light)
        .hljs-quote, .hljs-string, .hljs-symbol, .hljs-bullet, .hljs-addition
            color: var(--mainStyles-fontColor-highlight)
        .hljs-variable, .hljs-template-variable, .hljs-tag, .hljs-name, .hljs-selector-id, .hljs-selector-class, .hljs-regexp, .hljs-deletion, .hljs-keyword, .hljs-selector-tag, .hljs-attribute, .hljs-title, .hljs-section
            color: var(--mainStyles-fontHighlightColors-_0)
        .hljs-keyword, .hljs-selector-tag, .hljs-attribute
            font-style: italic
        .hljs-title, .hljs-section
            font-weight: bold
        .hljs-number, .hljs-built_in, .hljs-literal, .hljs-type, .hljs-params, .hljs-meta, .hljs-link
            color: var(--mainStyles-fontHighlightColors-_1)
        .hljs-emphasis
            font-style: italic
        .hljs-strong
            font-weight: bold
</style>
