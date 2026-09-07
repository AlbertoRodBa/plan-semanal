import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// IMPORTANT: change `base` to match your GitHub repo name, e.g. '/plan-semanal/'
// If you deploy to <username>.github.io (user/org site) or a custom domain, use base: '/'
export default defineConfig({
  base: '/plan-semanal/',
  plugins: [react(), tailwindcss()],
})
