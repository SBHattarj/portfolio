export function getNodeAttrs(node: Element) {
    return Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]));
}

export function convertAllToCssVariables(node: Record<any, any> | Array<any>, name = "mainStyles") {
    let currentObject: Record<any, any> | Array<any> = node;
    let prevObjects: any[] = [];
    let prevIndecies = []
    let path: (string|number)[] = []
    let properties: {var: string, value: any}[] = []
    while(currentObject != null) {
        let lastIndex = prevIndecies.length - 1
        if(prevIndecies.length == 0) {
            lastIndex = 0
            prevIndecies.push(0)
        }
        if(Array.isArray(currentObject)) {
            if(prevIndecies[lastIndex] >= currentObject.length) {
                currentObject = prevObjects.pop()
                prevIndecies.pop()
                path.pop()
                continue
            }
            const cur = currentObject[prevIndecies[lastIndex]]
            path.push(prevIndecies[lastIndex])
            prevIndecies[lastIndex]++
            if(typeof cur == "object" && cur != null) {
                prevObjects.push(currentObject)
                currentObject = cur;
                prevIndecies.push(0)
                continue
            }
            properties.push({
                var: path.reduce((acc, value) => {
                    if(typeof value === "number") {
                        return `${acc}-_${value}`
                    }
                    return `${acc}-${value}`
                }, `--${name}`) as string,
                value: cur
            })
            path.pop()
            continue
        }
        const keys = Object.keys(currentObject)
        if(keys.length <= prevIndecies[lastIndex]) {
            currentObject = prevObjects.pop()
            prevIndecies.pop()
            path.pop()
            continue
        }
        const cur = (currentObject as any)[keys[prevIndecies[lastIndex]]]
        path.push(keys[prevIndecies[lastIndex]])
        prevIndecies[lastIndex] += 1
        if(typeof cur == "object" && cur != null) {
            prevObjects.push(currentObject)
            currentObject = cur;
            prevIndecies.push(0)
            continue
        }
        properties.push({
            var: path.reduce((acc, value) => {
                if(typeof value === "number") {
                    return `${acc}-_${value}`
                }
                return `${acc}-${value}`
            }, `--${name}`) as string,
            value: cur
        })
        path.pop()
        continue
    }
    return properties.reduce((acc, {var: variable, value}) => {
        return `${acc}
        ${variable}: ${value};`
    }, "")
}
