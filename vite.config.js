import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hot: true,
    https: {
      hot: true,
      key: "./real-time-chat-app-privateKey.key",
      cert: "./real-time-chat-app.crt",
    },
  },
  plugins: [react(), eslint()],
});
