import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react';


export default defineConfig({
	assetsInclude: ['**/*.glb'],
	build: {
		target: 'es2022'
	},

	plugins: [    tailwindcss(), react()  ],

	base: '/'
});