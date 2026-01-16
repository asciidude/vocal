import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		hmr: {
			timeout: 120000
		}
	},
	preview: {
		allowedHosts: ['vocal.wtf', 'www.vocal.wtf'] // add your domain(s) here
	}
});