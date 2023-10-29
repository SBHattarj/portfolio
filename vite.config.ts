import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import WebSockets from "@carlosv2/adapter-node-ws/plugin";
import {serverBrowserSync} from "full-client-server-sveltekit/plugin";

export default defineConfig({
	plugins: [
		sveltekit(),
		WebSockets(),
		serverBrowserSync(),
        {
            name: "jquery-polyfill",
            enforce: "pre",
            resolveId(id) {
                if(id === "jquery") {
                    return "jquery";
                }
            },
            load(id) {
                if(id === "jquery") {
                    return "export default globalThis.$";
                }
            }
        },
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		hmr: {
			port: 3000
		}
	}
});
