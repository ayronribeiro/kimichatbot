import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "widget-entry.tsx"),
      name: "MentorChatWidget",
      fileName: () => `widget.js`,
      formats: ["iife"], // Gera bundle standalone
    },
    // Não externaliza React nem ReactDOM
    outDir: "public",
    emptyOutDir: false,
    minify: true,
  },
}); 