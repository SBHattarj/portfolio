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

export default function createSectionObserver(options: ConstructorParameters<typeof IntersectionObserver>[1] = {}) {
    let intersectionObserber: IntersectionObserver
    let {update, subscribe} = writable<sectionObserver>({
        sections: new Set(),
        visibleSections: new Set()
    });
    function sectionObserver(node: HTMLElement, name: string) {
        if(get({subscribe}).sections.has(name)) throw new NameAlreadyTakenError(name)
        if(intersectionObserber == null) intersectionObserber = new IntersectionObserver((e) => {
            e.forEach((e) => {
                let currentName = e.target.id
                if(e.isIntersecting) {
                    update(sections => {
                        sections.visibleSections.add(currentName)
                        return sections
                    })
                }
                if(!e.isIntersecting) {
                    update(sections => {
                        sections.visibleSections.delete(currentName)
                        return sections
                    })
                }
            })
        }, options)
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
