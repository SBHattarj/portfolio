import {writable} from "svelte/store"

export const MainStyles = writable({
    mainBackgroundColor: {
        accent: "hsl(0, 5%, 5%)",
        light: "hsl(0, 2%, 20%)",
        dark: "hsl(0, 0%, 2%)",
        highlight: "hsl(125, 100%, 55%)",
    },
    backgroundHighlightColors: [
        "hsl(185,100%,70%)"
    ],
    fontColor: {
        main: "hsl(0, 0%, 100%)",
        highlight: "hsl(103,100%,61%)"
    },
    fontHighlightColors: [
        "hsl(190,100%,75%)",
        "hsl(12, 100%, 50%)"
    ],
    indentBorderColors: [
        "hsla(12, 100%, 50%, 0.65)",
        "hsla(190, 100%, 75%, 0.7)",
        "hsla(103, 100%, 61%, 0.65)",
    ],
    indentBackgroundColors: [
        "hsla(12, 100%, 50%, 0.2)",
        "hsla(190, 100%, 75%, 0.1)",
        "hsla(103, 100%, 61%, 0.1)",
    ],
    fadedColor: {
        light: "hsla(0, 0%, 100%, 0.8)",
        highlight: "hsla(103, 100%, 61%, 0.7)"
    },

    spacing: {
        small: "0.25rem",
        normal: "0.5rem"
    },
    borderRadius: {
        normal: "1ch",
        big: "2ch",
    }
} as const)
