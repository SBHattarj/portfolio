import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@carlosv2/adapter-node-ws/adapter';
import preprocess from 'svelte-preprocess';
import { parse, walk } from 'svelte/compiler';
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

function createCSSVaraibleUpdaters(vars) {
	let svelteHead = `<svelte:head>
    {@html \`<style ${vars.hash}>
        :root {
        `;
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
				// append the document binding tag to the markup
				// const code = content + createDocumentBinding();

				files[filename] = {
					variables,
					hash: hash(filename)
				};
				const code = content + createCSSVaraibleUpdaters(files[filename]);
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
	],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};

export default config;
