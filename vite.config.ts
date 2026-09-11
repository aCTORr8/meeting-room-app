import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        manualChunks(moduleId) {
          const normalizedId = moduleId.replaceAll('\\', '/')

          if (
            normalizedId.includes('/@firebase/firestore/') ||
            normalizedId.includes('/@firebase/webchannel-wrapper/') ||
            normalizedId.includes('/firebase/firestore/')
          ) {
            return 'firebase-data'
          }

          if (
            normalizedId.includes('/@firebase/auth/') ||
            normalizedId.includes('/firebase/auth/')
          ) {
            return 'firebase-auth'
          }

          if (
            normalizedId.includes('/@firebase/') ||
            normalizedId.includes('/firebase/')
          ) {
            return 'firebase-core'
          }

          if (
            normalizedId.includes('/react-hook-form/') ||
            normalizedId.includes('/@hookform/resolvers/') ||
            normalizedId.includes('/zod/')
          ) {
            return 'forms'
          }

          if (
            normalizedId.includes('/react/') ||
            normalizedId.includes('/react-dom/') ||
            normalizedId.includes('/react-router/') ||
            normalizedId.includes('/react-router-dom/')
          ) {
            return 'react-vendor'
          }
        },
      },
    },
  },
  plugins: [react()],
})
