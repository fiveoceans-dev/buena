import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8085,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Plugin to handle ethereum injection conflicts
    {
      name: 'ethereum-fix',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Add headers to prevent ethereum injection conflicts
          res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
          res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
          next();
        });
      },
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['@vite/client', '@vite/env']
  },
}));
