import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {    
    allowedHosts: ['app', 'localhost'],
    proxy: {      
      '/api': {        
        target: 'http://localhost:8080/',        
        changeOrigin: true,      
      },    
    }  
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  }
})
