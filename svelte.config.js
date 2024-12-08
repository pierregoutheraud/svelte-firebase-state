import adapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		// This allows you to use your library components in the docs
		files: {
			lib: "src/lib"
		}
	},
	preprocess: vitePreprocess()
};

export default config;
