import hljs from "highlight.js";
import $ from "jquery"
function addCode(target: HTMLElement, lang = "auto") {
    let tabSize = -1;
    let indentSize = -1;
    const cls = [...($(target).parent()[0]?.classList ?? [])].find(cls => /^s-/.test(cls)) ?? "";
    let firstLine = false
    let indentType: "tab" | "space" = "tab";
    const innerHTML = target.innerHTML.split('\n').filter(line => {
        if(line.trim().length > 0) firstLine = true
        return firstLine
    }).map(line => {
        if(tabSize === -1 && indentType === "tab") {
            tabSize = line.search(/[^\t\s]/)
        }
        const newLine = line.substring(tabSize)
        if(indentSize < 2) {
            let indent = newLine.search(/[^\t\s]/)
            if(indent > 1) {
                indentType = "space"
                indentSize = indent
            }
        }

        
        return newLine
    }).join('\n');
    
    const highlighted = 
    lang === "auto" 
    ? hljs.highlightAuto(innerHTML).value
    : hljs.highlight(innerHTML, {language: lang}).value;
    let lines = 0;
    const highlightedCode = highlighted.split('\n').map((line, index) => {
        lines = index + 1
        if(!/<span.*<\/span>/.test(line) && /<span/.test(line)) line = `${line}</span>`
        if(indentSize < 1) {
            indentSize = line.search(/[^\t]/)
        }
        if(indentSize > 0) {
            line = `${line.replace(new RegExp(`^[${indentType === "tab" ? "\\t" : "\\s"}]+`, 'g'), (str) =>{
                
                return `${str.replace(
                    new RegExp(`[${indentType === "tab" ? "\\t" : "\\s"}]{${indentSize}}`, 'g'), 
                    str => `<span class="hljs-whitespace">${str}</span>`
                )}<span>`
            })}</span>`
        }
        line = `<span class="hljs-code-line hljs-line-${index + 1} ${cls}" style="grid-row: ${index + 1} / ${index + 2}">${
            line.replace(/class="/g, `class="${cls} `)
        }</span>`
        return line
    }).join('\n').replaceAll("&amp;", "&")
    const lineIds = new Array(lines).fill(0).map((_, index) => {
        return `<span class="${cls} hljs-line-id hljs-line-${index + 1}" style="grid-area: ${index + 1} / 1 / ${index + 2} / 2">${index+1}</span>`
    }).join('\n')
    const $target = $(target).addClass(cls)
    const $parent = $target.parent().addClass(cls).addClass("hljs")
    $target.siblings().remove()
    $target.css("display", "none")
    $parent.prepend(lineIds)
    $parent
        .append(`<code class="${cls} hljs-code-block" style="grid-area: 1 / 2 / ${lines + 2} / 3; display: grid; grid-template-columns: subgrid; grid-template-rows: subgrid;">${highlightedCode}</code>`)
        .css("display", "grid")
        .css("grid-template-columns", "auto 1fr")
        .css("grid-auto-rows", "max-content")
        .addClass("hljs")

}

export function codeBlock(node: HTMLElement, {lang = "auto"}: {lang?: string} = {}) {
    const codeBlock = node.querySelector<HTMLElement>("*") ?? node.appendChild(document.createElement("code"))

    addCode(codeBlock, lang);

    const mutationObserver = new MutationObserver((m) => {
        m.forEach(() => {
            addCode(codeBlock, lang)
        })
    })
    mutationObserver.observe(codeBlock, {
        childList: true,
        subtree: true,
        characterData: true
    })
}
