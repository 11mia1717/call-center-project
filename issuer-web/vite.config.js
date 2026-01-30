import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,
        strictPort: true,
        host: true,
        allowedHosts: ['localhost', '127.0.0.1'],
    }
})
