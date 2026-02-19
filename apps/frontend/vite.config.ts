import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import path from 'node:path';

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
			// монорепо: зависимости поднимаются в корень, Vite ищет в apps/frontend/node_modules
			zod: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..', 'node_modules/zod'),
			'vee-validate': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..', 'node_modules/vee-validate'),
			'@vee-validate/zod': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..', 'node_modules/@vee-validate/zod'),
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
