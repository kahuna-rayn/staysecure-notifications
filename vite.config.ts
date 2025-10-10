import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "NotificationSystem",
      formats: ["es", "umd"],
      fileName: (format) => `index.${format === "es" ? "esm" : format}.js`
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@supabase/supabase-js",
        "@tanstack/react-query",
        "@aws-sdk/client-ses",
        "react-router-dom",
        /^@\/components\//,
        /^@\/assets\//,
        /^@\/integrations\//,
        /^@\/lib\//,
        /^@\/hooks\//,
        /^@\/utils\//,
        /^@\/types\//
      ],
      output: {
        globals: {
          "react": "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "react/jsx-runtime",
          "@supabase/supabase-js": "Supabase",
          "@tanstack/react-query": "ReactQuery",
          "@aws-sdk/client-ses": "AWSSES",
          "react-router-dom": "ReactRouterDOM"
        }
      }
    },
    sourcemap: true,
    minify: false
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/components": resolve(__dirname, "src/components"),
      "@/hooks": resolve(__dirname, "src/hooks"),
      "@/utils": resolve(__dirname, "src/utils"),
      "@/types": resolve(__dirname, "src/types"),
      "@/lib": resolve(__dirname, "src/lib")
    }
  }
});