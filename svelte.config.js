import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@carlosv2/adapter-node-ws/adapter';
import preprocess from 'svelte-preprocess';
import { parse, walk } from 'svelte/compiler';

function svgExtender(svg, nodeAttr) {
    if(svg.trim().replace(/\n/g, "").endsWith("svg>")) {
        svg = svg.trim().replace(/\n/g, "").replace(/^[\s\S]*<svg/, "<svg")

    }
    const svgTagIndex = svg.search(/<svg[^>]*>/)
    if(svgTagIndex !== 0) {
        return
    }
    const svgTag = svg.match(/<svg[^>]*>/)[0]
    const svgAttr = Object.fromEntries(svgTag
        ?.match(/[\s\n]([-_#\:a-zA-Z0-9]+\=("[^"]+")|[-_#\:a-zA-Z0-9]+)/g)
        ?.map(attr => {
            const keyValuePair = attr.trim().split("=").map(val => val.replace(/"/g, ""))
            if(keyValuePair.length < 2) return [keyValuePair[0], true]
            return keyValuePair
        }) ?? []
    )
    const newTag = `<svg${Object.entries({...svgAttr, ...nodeAttr})
            .reduce(
                (prev, attr) =>
                    attr[1] === true 
                    ? `${prev} ${attr[0]}` 
                    : `${prev} ${attr[0]}="${attr[1]}"`,
            "")}>`
    const newSvg = svgTagIndex === 0 ? svg.replace(svgTag, newTag) : `${newTag}${svg}</svg>`
    return newSvg
}

function svgExtend() {
    return {
        markup({ content }) {
            let parsedContent = parse(content);
            /** 
             * @type {{replacer: string, start: number, end: number}[]}
             */
            let replacers = []
            walk(parsedContent, {
                enter(node) {
                    if(node.type !== "Element") return
                    if(node.name !== "svg") return
                    const extendAttr = node.attributes.find(attr => {
                        if(attr.type === "Action" && attr.name === "svgExtend") {
                            return true
                        }
                    })
                    if(extendAttr == null) return
                    if(extendAttr?.value === true) {
                        throw new Error("src must be a string")
                    }
                    const nodeAttr = node.attributes.map(attr => {
                        if(attr.type === "Action") return false
                        if(attr.name === "extend") return false
                        if(attr.value[0]?.type === "MustacheTag") {
                            const expression = content.slice(
                                attr.value[0]?.expression?.start,
                                attr.value[0]?.expression?.end
                            )
                            return [attr.name, expression]
                        }
                        if(attr.value === true) return [attr.name, true]
                        return [attr.name, `"${attr.value[0]?.data}"`]
                    }).filter(attr => attr)
                    const extendAttrValue = content.slice(extendAttr.expression.start, extendAttr.expression.end)

                    const svgReplaced = `
                    {#if import.meta.env.SSR}
                        {@html (${svgExtender.toString()})(${extendAttrValue}, {${
                            nodeAttr.reduce((prev, [key, value]) => {
                                return `${prev}"${key}": ${value},`
                            }, "")
                        }})}
                    {:else}
                        ${content.slice(node.start, node.end)}
                    {/if}
                    `
                    replacers.unshift({ replacer: svgReplaced, start: node.start, end: node.end })
                }
            })
            if(replacers.length === 0) return
            replacers.forEach(({replacer, start, end}) => {
                content = `${content.slice(0, start)}${replacer}${content.slice(end)}`
            })
            return {
                code: content
            }
        }
    }
}


function intersection(arrA, arrB) {
	let _intersection = [];
	for (let elem of arrB) {
		if (arrA.includes(elem)) {
			_intersection.push(elem);
		}
	}
	return _intersection;
}

function intersectionScriptToStyle(scripts, styles) {
	let selectedStyle = [];
	let selectedScript = [];
	return intersection(
		scripts,
		styles.map((style) => style.replace(/\-.+$/, ''))
	).map((variable) => ({
		name: variable,
		style: styles.find((style) => {
			if (!style.startsWith(variable)) return false;
			if (selectedStyle.includes(style)) return false;
			selectedStyle.push(style);
			return true;
		}),
		script: styles
			.find((style) => {
				if (!style.replace(/\-.+$/, '').startsWith(variable)) return false;
				if (selectedScript.includes(style)) return false;
				selectedScript.push(style);
				return true;
			})
			?.replace(/\-\_[^-]+(?=\-{0,1})/g, (match) => `?.[${parseInt(match.replace(/[-_]/g, ''))}]`)
			?.replace(/-/g, '?.')
	}));
}

// https://github.com/sveltejs/svelte/blob/master/src/compiler/compile/utils/hash.ts
function hash(str) {
	str = str.replace(/\r/g, '');
	let hash = 5381;
	let i = str.length;

	while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
	return (hash >>> 0).toString(36);
}

function createCSSVaraibleUpdaters(vars, hash) {
	let svelteHead = `<svelte:head>
    {@html \`<style ${vars.hash}>
        :root {
        `;
	for (let { style, script } of vars.variables) {
		if (style == null || script == null) continue;
		svelteHead += `--${style}-${vars.hash}: \${${script}};\n`;
	}
    svelteHead += `
    }
    [data-${hash}="$\{s${hash}}"] {
    `
	for (let { style, script } of vars.variables) {
		if (style == null || script == null) continue;
		svelteHead += `--${style}-${vars.hash}: \${${script}};\n`;
	}
	return `${svelteHead}
    }
    </style>\`}
    </svelte:head>`;
}

function cssUpdatePreprocessor() {
	const files = {};

	return {
		markup: ({ content, filename }) => {
			const ast = parse(content);

			const scriptVars = [];
			const styleVars = [];

			const nodeTypes = [
				'Script',
				'Program',
				'ExportNamedDeclaration',
				'LabeledStatement',
				'VariableDeclaration',
				'VariableDeclarator'
			];

			walk(ast.instance, {
				enter(node) {
					if (!nodeTypes.includes(node.type)) {
						this.skip();
					}

					if (node.type === 'VariableDeclarator') {
						scriptVars.push(node?.id.name);
					}

					// handle `$: myvar = 'something'` syntax
					if (node.type === 'ExpressionStatement') {
						walk(node.expression, {
							enter(node) {
								if (['AssignmentExpression'].includes(node.type)) {
									if (node.left.type === 'Identifier') {
										scriptVars.push(node.left.name);
									}

									this.skip();
								}
							}
						});
					}
				}
			});

			walk(ast.css, {
				enter(node) {
					if (node.type === 'Function' && node.name === 'var') {
						// substr to remove leading '--'
						styleVars.push(node.children[0].name.substr(2));
					}
				}
			});

			// Find variables that are referenced in the css vars and set them in the files object.
			const variables = intersectionScriptToStyle(scriptVars, styleVars);
			if (variables.length) {
                const hashed = hash(filename);
                const replacers = []
                walk(ast.html, {
                    enter(node) {
                        if(node.type !== "Element") return
                        const [currentContent, elem] = content.slice(node.start, node.end).match(/\<([A-Za-z0-9-]+)/) ?? []
                        if(currentContent == null || elem == null) return
                        const contentNext = currentContent + " data-" + hashed + "={s" + hashed + "}"
                        replacers.unshift({
                            content: contentNext,
                            start: node.start,
                            end: node.start + currentContent.length
                        })
                    }
                })
				// append the document binding tag to the markup
				// const code = content + createDocumentBinding();

				files[filename] = {
					variables,
					hash: hashed
				};
                replacers.forEach(({content: code, start, end}) => {
                    content = `${content.slice(0, start)}${code}${content.slice(end)}`
                })
				const code = createCSSVaraibleUpdaters(files[filename], files[filename].hash) + content;
				return {
					code
				};
			}
		},
		style: ({ content, filename }) => {
			if (!files[filename]) {
				return;
			}

			const file = files[filename];

			// add hash to variables
			let code = content;

			for (let { style } of file.variables) {
				const re = new RegExp(`var\\(\\s*--${style}\\s*\\)`, 'g');
				code = code.replace(re, `var(--${style}-${file.hash})`);
			}
			return {
				code
			};
		},
        script({content, filename}) {
            if(!files[filename]) return
            return {
                code: content + `let s${files[filename].hash} = globalThis["${files[filename].hash}"] ?? 0;
                globalThis["${files[filename].hash}"] = s${files[filename].hash} + 1;`
            }
        }
	};
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
        vitePreprocess({}),
        preprocess({
            css: false,
            postcss: false,
            scss: false,
            sass: false
        }),
        {
            style({content}) {
                return { code: content?.replace(/\.js\-has\-pseudo\s\[.*\]/g, str => `:global(${str})`) }
            }
        },
        cssUpdatePreprocessor(),
        svgExtend(),
	],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
