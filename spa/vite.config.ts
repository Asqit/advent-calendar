import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

const defaultConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};

export default defineConfig(({ command, mode }) => {
  if (command === "serve") {
    const isDev = mode === "development";
    return {
      ...defaultConfig,
      server: {
        proxy: {
          "/api": {
            target: "http://asqit-calendar.deno.dev/",
            rewrite: (path) => path.replace(/^\/api/, ""),
            changeOrigin: isDev,
            secure: !isDev,
          },
        },
      },
    };
  } else {
    return {
      ...defaultConfig,
    };
  }
});
