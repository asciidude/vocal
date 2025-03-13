import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit()
	],
	server: {
		hmr: {
		  timeout: 120000 // Increase timeout to 120 seconds
		}
	}
});
