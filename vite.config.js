import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	assetsInclude: ['**/*.glb'],
	build: {
		target: 'es2022'
	},

	plugins: [    tailwindcss(),  ],

	base: '/'
});