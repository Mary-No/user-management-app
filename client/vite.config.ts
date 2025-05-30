import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    base: '/user-management-app/',
    plugins: [react()],
    server: {
        proxy: {
            '/api': 'https://residential-dorette-mary-no-e96a3900.koyeb.app/',
        },
    },
})
