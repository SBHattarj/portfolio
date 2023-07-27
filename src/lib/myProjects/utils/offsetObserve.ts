import type { ActionReturn } from "svelte/action";
import $ from "jquery";

export type offsetEventDetail = {
    offset: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    container: HTMLElement;
}

type Atributes = {
    'on:offsetChange'?: (e: CustomEvent<offsetEventDetail>) => void;
}

export function offsetObserve(
    node: HTMLElement
): ActionReturn<null, Atributes> {
    async function onScroll(e: Event) {
        const target = e.target as HTMLElement
        const offset = {
            x: node.offsetLeft - target.scrollLeft,
            y: node.offsetTop - target.scrollTop,
            width: node.clientWidth,
            height: node.clientHeight
        }
        node.dispatchEvent(new CustomEvent("offsetChange", {
            detail: {
                offset,
                container: target
            }
        }))
    }
    $(node).parent().on("scroll", onScroll)
    $(node).parent().on("scrollend", onScroll)
    $(node).parent().trigger("scroll")
    return {
        destroy() {
            $(node).parent().off("scroll", onScroll)
        }
    }
}
