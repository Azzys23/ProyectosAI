
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Inyectamos las variables de entorno de Vercel en el código del cliente
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldWNueHRqYXJheWx4c3l6aGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNzkwMTEsImV4cCI6MjA4Mjk1NTAxMX0.yhziAlOK6MnP4IS3K6Nabgpv-eebmL2IUIYfCeQJt90'),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL || 'https://reucnxtjaraylxsyzhab.supabase.co'),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJldWNueHRqYXJheWx4c3l6aGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczNzkwMTEsImV4cCI6MjA4Mjk1NTAxMX0.yhziAlOK6MnP4IS3K6Nabgpv-eebmL2IUIYfCeQJt90'),
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    // Removed invalid 'historyApiFallback' property as Vite handles SPA routing by default.
  }
});
