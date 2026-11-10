import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In demo mode the dev server serves index-demo.html (phone wrapper) at the root
const demoEntry = () => ({
  name: 'demo-entry',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const [path, query = ''] = req.url.split('?')
      if (path === '/' || path === '/Unburden/' || path === '/Unburden' || path === '/index.html') {
        req.url = '/Unburden/index-demo.html' + (query ? `?${query}` : '')
      }
      next()
    })
  },
})

export default defineConfig(({ mode }) => ({
  base: '/Unburden/',
  plugins: [react(), ...(mode === 'demo' ? [demoEntry()] : [])],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        demo: './index-demo.html',
      },
    },
  },
}))

