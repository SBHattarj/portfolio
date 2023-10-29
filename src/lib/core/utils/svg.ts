import { getNodeAttrs } from "./node";
import type { ActionReturn } from "svelte/action"
import $ from "jquery";

export function svgExtend(svg: SVGElement, extender: string): ActionReturn<string> {
    let svgAttr = getNodeAttrs(svg);
    if(extender.trim().replace(/\n/g, "").endsWith("svg>")) {
        extender = extender.trim().replace(/\n/g, "").replace(/^[\s\S]*<svg/, "<svg")
    }
    console.log("svg extender", extender)
    let $extender = $<SVGElement>(extender);
    const returnValue = {
        update(extender: string) {
            svgExtend(svg, extender)
        }
    }
    if($extender.prop("tagName").toLowerCase() === "svg") {
        $extender
            .attr(svgAttr)
            .prepend($(svg).children().not(".after"))
            .append($(svg).children(".after"))
            .replaceAll(svg)
        return returnValue
    }
    $(svg).empty().append($extender)
    return returnValue
}
