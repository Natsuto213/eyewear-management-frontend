import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

// Vì bạn dùng ESM (import/export), cần định nghĩa lại __dirname nếu cần
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // @ trỏ thẳng vào thư mục src
      '@': path.resolve(__dirname, './src'),
    },
  },
})