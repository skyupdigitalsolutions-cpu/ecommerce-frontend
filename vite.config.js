import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev we proxy /api to the backend, so the frontend is same-origin with the
// API (no CORS headaches, and the httpOnly refresh cookie just works).
// Set VITE_PROXY_TARGET if your backend runs somewhere other than :3000.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_PROXY_TARGET || "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
