import { get, writable } from "svelte/store";

type sectionObserver = {
    sections: Set<string>,
    visibleSections: Set<string>
}

class NameAlreadyTakenError extends Error {
    constructor(name: string) {
        super(`Name ${name} is already taken`);
        this.name = name
    }
}

export default function createSectionObserver() {
    let intersectionObserber: IntersectionObserver
    let {update, subscribe} = writable<sectionObserver>({
        sections: new Set(),
        visibleSections: new Set()
    });
    function sectionObserver(node: HTMLElement, name: string) {
        if(get({subscribe}).sections.has(name)) throw new NameAlreadyTakenError(name)
        if(intersectionObserber == null) intersectionObserber = new IntersectionObserver((e) => {
            e.forEach((e) => {
                if(e.isIntersecting) {
                    update(sections => {
                        sections.visibleSections.add(name)
                        return sections
                    })
                }
                if(!e.isIntersecting) {
                    update(sections => {
                        sections.visibleSections.delete(name)
                        return sections
                    })
                }
            })
        })
        intersectionObserber.observe(node)
        node.id = name
        update(sections => {
            sections.sections.add(name)
            return sections
        })
        return {
            destroy() {
                update(section => {
                    section.sections.delete(name)
                    section.visibleSections.delete(name)
                    return section
                })
                intersectionObserber.unobserve(node)
            }
        }
    }
    sectionObserver.subscribe = subscribe
    return sectionObserver
}
