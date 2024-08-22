import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend server
        changeOrigin: true, // This ensures the host header is modified to match the target
        secure: false, // If your backend is HTTPS and you want to disable SSL verification
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: to remove /api prefix if needed
      },
    },
  },
});
