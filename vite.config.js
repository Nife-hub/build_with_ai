import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Lets a temporary Cloudflare tunnel reach the dev server, for trying PitchPal on a phone
    // (phones only allow the microphone on a trusted https page).
    allowedHosts: ['.trycloudflare.com'],
  },
});
