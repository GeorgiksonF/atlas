import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		vue(),
		tailwindcss(),
		Components({
			resolvers: [PrimeVueResolver()],
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			zod: path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				'../..',
				'node_modules/zod',
			),
			'vee-validate': path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				'../..',
				'node_modules/vee-validate',
			),
			'@vee-validate/zod': path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				'../..',
				'node_modules/@vee-validate/zod',
			),
			'@utils': fileURLToPath(new URL('./src/shared/utils', import.meta.url)),
			'@features': fileURLToPath(new URL('./src/features', import.meta.url)),
			'@widgets': fileURLToPath(new URL('./src/widgets', import.meta.url)),
			'@entities': fileURLToPath(new URL('./src/entities', import.meta.url)),

			'@composables': fileURLToPath(new URL('./src/shared/composables', import.meta.url)),
			'@components': fileURLToPath(new URL('./src/shared/components', import.meta.url)),
		},
	},
	server: {
		port: 5173,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
});
