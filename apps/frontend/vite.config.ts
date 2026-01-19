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
			'@atlas/types': path.resolve(__dirname, '../../libs/types/src'),
			'@atlas/database': path.resolve(__dirname, '../../libs/database/src'),
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
