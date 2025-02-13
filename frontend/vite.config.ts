import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
/* export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
 */

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:10000",
    },
  },
});
