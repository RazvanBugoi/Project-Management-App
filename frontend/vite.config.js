import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: process.env.PORT || 3000,
    host: true
  },
  optimizeDeps: {
    include: [
      'jwt-decode',
      'formik',
      'yup',
      '@mui/material',
      '@mui/icons-material',
      '@mui/x-data-grid',
      '@emotion/react',
      '@emotion/styled'
    ]
  }
});
