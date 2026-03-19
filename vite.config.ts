import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  base: "./",

  build: {
    outDir: "dist",
    sourcemap: mode === "development",
    minify: "terser",
    target: "ES2020",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separar vendor chunks para melhor cache
          if (id.includes("node_modules")) {
            if (id.includes("react")) {
              return "vendor-react";
            }
            if (id.includes("@capacitor")) {
              return "vendor-capacitor";
            }
            return "vendor";
          }
        },
      },
    },
  },

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [react()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
